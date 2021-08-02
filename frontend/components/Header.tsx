import Link from 'next/link';
import React from 'react';
import { NavLink } from './NavLink';
import { Menu } from '@headlessui/react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { setAccessToken } from '../utils/accessToken';
import { useRouter } from 'next/router';

export const Header = () => {
	const { data, loading } = useMeQuery();
	const [logout] = useLogoutMutation();
	const apolloClient = useApolloClient();
	const router = useRouter();

	const logoutFunction = async () => {
		await logout();
		setAccessToken('');
		await apolloClient.resetStore();
		router.push('/auth/login');
	};

	return (
		<header className='py-4 bg-blue-600 px-4'>
			<nav className='container flex align-items-center space-x-4'>
				<Link href='/'>
					<a className='text-white font-semibold text-lg mr-4'>My Website</a>
				</Link>
				<button className='text-white block md:hidden'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
				<div className='flex-1 flex justify-between items-center'>
					<ul className='flex items-center space-x-4'>
						<li>
							<NavLink path='/about'>About us</NavLink>
						</li>
						<li>
							<Menu as='div' className='relative inline-block text-left'>
								<Menu.Button>
									<NavLink
										path='/services'
										hasSubmenu={true}
										exact={false}
										className='flex items-center'
									>
										<span className=''>Services</span>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											viewBox='0 0 20 20'
											fill='currentColor'
										>
											<path
												fillRule='evenodd'
												d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
												clipRule='evenodd'
											/>
										</svg>
									</NavLink>
								</Menu.Button>
								<Menu.Items className='absolute right-0 mt-2 w-32 bg-white rounded shadow-lg ring-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
									<div className='flex flex-col p-1'>
										<Menu.Item>
											{({ active }) => (
												<div className={`${active && 'bg-blue-50'}  rounded`}>
													<Link href='/services/a'>
														<a className='block px-4 py-1'>Service A</a>
													</Link>
												</div>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<div className={`${active && 'bg-blue-50'} rounded`}>
													<Link href='/services/b'>
														<a className='block px-4 py-1'>Service B</a>
													</Link>
												</div>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Menu>
						</li>
					</ul>
					<ul className='flex items-center space-x-4'>
						<li>
							<Link href='/'>
								<a className='text-gray-200 hover:text-gray-50'>
									<svg
										className='h-5 w-5'
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										fill='currentColor'
									>
										<title>Facebook</title>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</a>
							</Link>
						</li>
						<li>
							<Link href='/'>
								<a className='text-gray-200 hover:text-gray-50'>
									<svg
										className='h-5 w-5'
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										fill='currentColor'
									>
										<title>Twitter</title>
										<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
									</svg>
								</a>
							</Link>
						</li>
						<li>
							<Link href='/'>
								<a className='text-gray-200 hover:text-gray-50'>
									<svg
										className='h-5 w-5'
										role='img'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										fill='currentColor'
									>
										<title>GitHub</title>
										<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
									</svg>
								</a>
							</Link>
						</li>
						{loading ? (
							<li></li>
						) : data && data.me ? (
							<li>
								<Menu as='div' className='relative inline-block text-left'>
									<Menu.Button>
										<NavLink
											path='/user'
											hasSubmenu={true}
											exact={false}
											className='flex items-center'
										>
											<span className=''>Welcome, {data.me.name}</span>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5'
												viewBox='0 0 20 20'
												fill='currentColor'
											>
												<path
													fillRule='evenodd'
													d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</NavLink>
									</Menu.Button>
									<Menu.Items className='absolute right-0 mt-2 w-32 bg-white rounded shadow-lg ring-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<div className='flex flex-col p-1'>
											<Menu.Item>
												{({ active }) => (
													<div className={`${active && 'bg-blue-50'}  rounded`}>
														<Link href='/user/profile'>
															<a className='block px-4 py-1'>My profile</a>
														</Link>
													</div>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<div className={`${active && 'bg-blue-50'} rounded`}>
														<button
															className='block px-4 py-1'
															onClick={() => logoutFunction()}
														>
															Logout
														</button>
													</div>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Menu>
							</li>
						) : (
							<li>
								<NavLink path='/auth/login'>Sign in/up</NavLink>
							</li>
						)}
					</ul>
				</div>
			</nav>
		</header>
	);
};
