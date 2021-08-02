import Head from 'next/head';
import React from 'react';
import { Layout } from '../../components/Layout';
import { useProtectedQuery } from '../../generated/graphql';
import withApollo from '../../utils/withApollo';

interface profileProps {}

const profile: React.FC<profileProps> = ({}) => {
	const { data, loading, error } = useProtectedQuery({
		fetchPolicy: 'network-only',
	});

	if (error?.networkError) {
		return <div className=''>A net work error</div>;
	}

	if (error?.graphQLErrors) {
		return <div className=''>gql error</div>;
	}

	if (loading) {
		return <div className=''>loading</div>;
	}

	return (
		<Layout>
			<Head>
				<title>Profile</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				{error ? 'err' : !data ? 'no data' : data.protected}
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: false })(profile);
