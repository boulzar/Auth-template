import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import argon2 from 'argon2';
import { getConnection } from 'typeorm';
import { LoginInput, RegisterInput, UserResponse } from '../types/user';
import { validateRegister } from '../validations/register';
import { User } from '../entities/User';
import { validateLogin } from '../validations/login';
import { ApiContext } from '../types/common';
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from '../utils/tokenFunctions';
import { verify } from 'jsonwebtoken';
import { isAuth } from '../middlewares/isAuth';

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: RegisterInput
	): Promise<UserResponse> {
		const errors = validateRegister(options);
		if (errors) {
			return { errors };
		}
		const hashedPassword = await argon2.hash(options.password);
		const { name, email } = options;

		const exists = await getConnection()
			.createQueryBuilder(User, 'u')
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
			const results = await getConnection()
				.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					name,
					email,
					password: hashedPassword,
				})
				.returning('*')
				.execute();
			const user: User = results.raw[0];
			return { user };
		} catch (err) {
			console.log(err);
			return {
				message: 'An error occurred',
			};
		}
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('options') options: LoginInput,
		@Ctx() { res }: ApiContext
	): Promise<UserResponse> {
		const errors = validateLogin(options);

		if (errors) {
			return { errors };
		}
		const { email, password } = options;

		const user = await User.findOne({ email });

		if (!user) {
			return {
				message: 'Invalid credentials',
			};
		}

		const isValid = argon2.verify(user.password, password);

		if (!isValid) {
			return {
				message: 'Invalid credentials',
			};
		}

		sendRefreshToken(res, createRefreshToken(user));

		return { user, accessToken: createAccessToken(user) };
	}

	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: ApiContext): Promise<User | null> {
		const authorization = req.headers['authorization'];

		if (!authorization) {
			return null;
		}

		try {
			const token = authorization.split(' ')[1];
			const payload: any = verify(token, process.env.ACCESS_SECRET!);
			const user = await User.findOne(payload.userId);
			if (!user) {
				return null;
			}
			return user;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: ApiContext) {
		sendRefreshToken(res, '');

		return true;
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	protected(@Ctx() { payload }: ApiContext) {
		console.log(payload);
		return `your user id is: ${payload!.userId}`;
	}
}
