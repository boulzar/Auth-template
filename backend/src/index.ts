import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'dotenv-safe/config';
import { createConnection } from 'typeorm';
import path from 'path';
import { User } from './entities/User';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import cors from 'cors';
import { ApiContext } from './types/common';
import { UserResolver } from './resolvers/user';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from './utils/tokenFunctions';

console.log('test');

const main = async () => {
	const connection = await createConnection({
		type: 'postgres',
		url: process.env.DATABASE_URL,
		logging: true,
		synchronize: false,
		migrations: [path.join(__dirname, './migrations/*')],
		entities: [User],
	});
	await connection.runMigrations();

	const app = express();

	app.use(
		cors({
			origin: ['https://studio.apollographql.com', process.env.CORS_ORIGIN!],
			credentials: true,
		})
	);

	app.use(cookieParser());

	app.post('/refresh_token', async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: '' });
		}

		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_SECRET!);
		} catch (err) {
			console.log(err);
			return res.send({ ok: false, accessToken: '' });
		}

		// token is valid and
		// we can send back an access token
		const user = await User.findOne({ id: payload.userId });

		if (!user) {
			return res.send({ ok: false, accessToken: '' });
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: '' });
		}

		sendRefreshToken(res, createRefreshToken(user));

		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }: ApiContext) => ({
			req,
			res,
		}),
	});
	await apolloServer.start();

	apolloServer.applyMiddleware({
		app,
		cors: false,
	});

	app.listen(parseInt(process.env.PORT), () => {
		console.log('server started on localhost:4000');
	});
};

main().catch((err) => {
	console.log(err);
});
