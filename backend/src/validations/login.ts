import { LoginInput } from '../types/user';

export const validateLogin = (options: LoginInput) => {
	if (!options.email.includes('@')) {
		return [
			{
				field: 'email',
				message: 'invalid email',
			},
		];
	}

	if (options.password.length <= 2) {
		return [
			{
				field: 'password',
				message: 'length must be greater than 2',
			},
		];
	}

	return null;
};
