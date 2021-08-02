import Head from 'next/head';
import React from 'react';
import { Layout } from '../components/Layout';
import withApollo from '../utils/withApollo';

interface aboutProps {}

const About: React.FC<aboutProps> = ({}) => {
	return (
		<Layout>
			<Head>
				<title>About us</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				About
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: true })(About);
