import { useFormik } from 'formik';
import Head from 'next/head';
import React, { useContext, useState } from 'react';
import FormControl from '../../components/FormControl';
import * as Yup from 'yup';
import Link from 'next/link';
import { AuthContext } from '../../utils/AuthContext';
import { MeDocument, MeQuery, useLoginMutation } from '../../generated/graphql';
import { fieldErrorToFormik } from '../../utils/fieldErrorToFormik';
import { useRouter } from 'next/dist/client/router';
import withApollo from '../../utils/withApollo';
import { setAccessToken } from '../../utils/accessToken';
import { Layout } from '../../components/Layout';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const [showPassword, setshowPassword] = useState(false);
	const { authMsg, status } = useContext(AuthContext);
	const router = useRouter();
	const [login] = useLoginMutation();

	const showHideButton = (
		<button
			className='text-gray-700'
			type='button'
			onClick={() => setshowPassword(!showPassword)}
		>
			{showPassword ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path
						fillRule='evenodd'
						d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
						clipRule='evenodd'
					/>
					<path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
				</svg>
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 20 20'
					fill='currentColor'
				>
					<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
					<path
						fillRule='evenodd'
						d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
						clipRule='evenodd'
					/>
				</svg>
			)}
		</button>
	);

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email('Please enter a valid email')
			.required()
			.label('Email'),
		password: Yup.string().required().label('Password'),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values, { setErrors, setStatus }) => {
			const results = await login({
				variables: { options: values },
				update: (store, { data }) => {
					if (!data) {
						return null;
					}
					return store.writeQuery<MeQuery>({
						query: MeDocument,
						data: {
							me: data.login.user,
						},
					});
				},
			});

			if (results.data?.login.user) {
				router.push('/dashboard');
				setAccessToken(results.data.login.accessToken || '');
			}
			if (results.data?.login.errors) {
				setErrors(fieldErrorToFormik(results.data?.login.errors));
			}
			if (results.data?.login.message) {
				setStatus(results.data?.login.message);
			}
		},
	});
	return (
		<Layout>
			<Head>Login</Head>
			<div className='flex flex-col items-center justify-center mt-12'>
				<form
					className='border border-gray-100 py-6 px-6 md:px-10 sm:w-96'
					onSubmit={formik.handleSubmit}
				>
					<h3 className='text-3xl font-semibold text-blue-600 text-center mb-4'>
						Login
					</h3>
					{formik.status && (
						<div
							className={`p-3 bg-red-100 text-red-800 text-sm font-medium rounded mb-4`}
						>
							{formik.status}
						</div>
					)}
					{authMsg && (
						<div
							className={`p-3 bg-${status}-100 text-${status}-800 text-sm font-medium rounded mb-4`}
						>
							{authMsg}
						</div>
					)}
					<FormControl
						formik={formik}
						name='email'
						label='Email'
						inputType='email'
						required={true}
					/>
					<FormControl
						formik={formik}
						name='password'
						label='Password'
						inputType={showPassword ? 'text' : 'password'}
						required={true}
						append={showHideButton}
					/>
					<div className='text-right'>
						<Link href='/auth/register'>
							<a className='text-blue-400 hover:underline'>
								Not a member? Sign up
							</a>
						</Link>
					</div>
					<button
						className='w-full mt-6 bg-blue-600 text-white p-2 text-lg font-medium rounded hover:bg-blue-700'
						type='submit'
					>
						Login
					</button>
				</form>
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: false })(Login);
