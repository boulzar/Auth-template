import Head from 'next/head';
import React from 'react';
import { Layout } from '../../components/Layout';
import withApollo from '../../utils/withApollo';

interface bProps {}

const B: React.FC<bProps> = ({}) => {
	return (
		<Layout>
			<Head>
				<title>Services</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				Service B
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: true })(B);
