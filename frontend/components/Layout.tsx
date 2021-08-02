import React from 'react';
import Footer from './Footer';
import { Header } from './Header';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='flex flex-col justify-between min-h-screen'>
			<Header />
			<div className='container flex-grow py-8'>{children}</div>
			<Footer />
		</div>
	);
};
