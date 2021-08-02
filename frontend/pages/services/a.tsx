import Head from 'next/head';
import React from 'react';
import { Layout } from '../../components/Layout';
import withApollo from '../../utils/withApollo';

interface aProps {}

const A: React.FC<aProps> = ({}) => {
	return (
		<Layout>
			<Head>
				<title>Services</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				Service A
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: true })(A);
