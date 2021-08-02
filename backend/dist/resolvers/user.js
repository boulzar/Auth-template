"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const user_1 = require("../types/user");
const register_1 = require("../validations/register");
const User_1 = require("../entities/User");
const login_1 = require("../validations/login");
const tokenFunctions_1 = require("../utils/tokenFunctions");
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth_1 = require("../middlewares/isAuth");
let UserResolver = class UserResolver {
    register(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = register_1.validateRegister(options);
            if (errors) {
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const { name, email } = options;
            const exists = yield typeorm_1.getConnection()
                .createQueryBuilder(User_1.User, 'u')
                .where('u.email=:email', { email })
                .getOne();
            if (exists) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: 'Email is taken',
                        },
                    ],
                };
            }
            try {
                const results = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User_1.User)
                    .values({
                    name,
                    email,
                    password: hashedPassword,
                })
                    .returning('*')
                    .execute();
                const user = results.raw[0];
                return { user };
            }
            catch (err) {
                console.log(err);
                return {
                    message: 'An error occurred',
                };
            }
        });
    }
    login(options, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = login_1.validateLogin(options);
            if (errors) {
                return { errors };
            }
            const { email, password } = options;
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                return {
                    message: 'Invalid credentials',
                };
            }
            const isValid = argon2_1.default.verify(user.password, password);
            if (!isValid) {
                return {
                    message: 'Invalid credentials',
                };
            }
            tokenFunctions_1.sendRefreshToken(res, tokenFunctions_1.createRefreshToken(user));
            return { user, accessToken: tokenFunctions_1.createAccessToken(user) };
        });
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (!authorization) {
                return null;
            }
            try {
                const token = authorization.split(' ')[1];
                const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_SECRET);
                const user = yield User_1.User.findOne(payload.userId);
                if (!user) {
                    return null;
                }
                return user;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
    }
    logout({ res }) {
        return __awaiter(this, void 0, void 0, function* () {
            tokenFunctions_1.sendRefreshToken(res, '');
            return true;
        });
    }
    protected({ payload }) {
        console.log(payload);
        return `your user id is: ${payload.userId}`;
    }
};
__decorate([
    type_graphql_1.Mutation(() => user_1.UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => user_1.UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Query(() => String),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "protected", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map