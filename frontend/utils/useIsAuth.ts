import { useRouter } from 'next/dist/client/router';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
	const router = useRouter();
	const { data, loading } = useMeQuery();

	if (loading) {
		return false;
	}

	if (!data || !data.me) {
		return router.push('/auth/login');
	}

	return true;
};
