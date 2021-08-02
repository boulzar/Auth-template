import Head from 'next/head';
import React from 'react';
import { Layout } from '../components/Layout';
import withApollo from '../utils/withApollo';

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = ({}) => {
	return (
		<Layout>
			<Head>
				<title>Dashboard</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				Dashboard
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: true })(dashboard);
