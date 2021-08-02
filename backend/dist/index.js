"use strict";
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
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("dotenv-safe/config");
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const User_1 = require("./entities/User");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./resolvers/user");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = require("jsonwebtoken");
const tokenFunctions_1 = require("./utils/tokenFunctions");
console.log('test');
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield typeorm_1.createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true,
        synchronize: false,
        migrations: [path_1.default.join(__dirname, './migrations/*')],
        entities: [User_1.User],
    });
    yield connection.runMigrations();
    const app = express_1.default();
    app.use(cors_1.default({
        origin: ['https://studio.apollographql.com', process.env.CORS_ORIGIN],
        credentials: true,
    }));
    app.use(cookie_parser_1.default());
    app.post('/refresh_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ ok: false, accessToken: '' });
        }
        let payload = null;
        try {
            payload = jsonwebtoken_1.verify(token, process.env.REFRESH_SECRET);
        }
        catch (err) {
            console.log(err);
            return res.send({ ok: false, accessToken: '' });
        }
        const user = yield User_1.User.findOne({ id: payload.userId });
        if (!user) {
            return res.send({ ok: false, accessToken: '' });
        }
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: '' });
        }
        tokenFunctions_1.sendRefreshToken(res, tokenFunctions_1.createRefreshToken(user));
        return res.send({ ok: true, accessToken: tokenFunctions_1.createAccessToken(user) });
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, user_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on localhost:4000');
    });
});
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map