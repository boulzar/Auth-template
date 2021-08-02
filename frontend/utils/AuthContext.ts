import { createContext } from 'react';

type authContext = {
	authMsg: string;
	status: string;
};

export const AuthContext = createContext({
	authMsg: '',
	status: '',
	updateAuth: (state: authContext) => {
		console.log(state);
	},
});
