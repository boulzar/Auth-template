import 'tailwindcss/tailwind.css';
import { AppProps } from 'next/app';
import { AuthContext } from '../utils/AuthContext';
import { useEffect, useState } from 'react';
import { setAccessToken } from '../utils/accessToken';

function MyApp({ Component, pageProps }: AppProps) {
	const [loading, setloading] = useState(true);
	const [values, setvalues] = useState({
		authMsg: '',
		status: '',
	});
	useEffect(() => {
		fetch('http://localhost:4000/refresh_token', {
			method: 'POST',
			credentials: 'include',
		}).then(async (x) => {
			const { accessToken } = await x.json();
			setAccessToken(accessToken);
			setloading(false);
		});
	}, []);

	if (loading) {
		return <div className=''>loading</div>;
	}

	return (
		<AuthContext.Provider value={{ ...values, updateAuth: setvalues }}>
			<Component {...pageProps} />
		</AuthContext.Provider>
	);
}

export default MyApp;
