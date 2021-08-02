import { User } from '../entities/User';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

export const createAccessToken = (user: User) => {
	return sign({ userId: user.id }, process.env.ACCESS_SECRET!, {
		expiresIn: '15m',
	});
};

export const createRefreshToken = (user: User) => {
	return sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_SECRET!,
		{ expiresIn: '7d' }
	);
};

export const sendRefreshToken = (res: Response, refreshToken: string) => {
	const expiresOn = new Date();
	expiresOn.setTime(expiresOn.getTime() + 3600000 * 24 * 7);

	res.cookie('jid', refreshToken, {
		httpOnly: true,
		path: '/refresh_token',
		expires: expiresOn,
	});
};
