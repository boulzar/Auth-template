import Head from 'next/head';
import { Layout } from '../components/Layout';
import withApollo from '../utils/withApollo';
function Home() {
	return (
		<Layout>
			<Head>
				<title>Home</title>
			</Head>
			<div className='flex items-center justify-center text-2xl font-semibold h-96'>
				Home
			</div>
		</Layout>
	);
}

export default withApollo({ ssr: true })(Home);
