import { useFormik } from 'formik';
import React from 'react';
import FormControl from '../components/FormControl';
import { Layout } from '../components/Layout';
import withApollo from '../utils/withApollo';

interface contactProps {}

const contact: React.FC<contactProps> = ({}) => {
	const initialValues = {
		name: '',
		email: '',
		message: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			console.log(values);
		},
	});
	return (
		<Layout>
			<div className='flex items-center justify-center w-full'>
				<form onSubmit={formik.handleSubmit} className='sm:w-96'>
					<FormControl label='Name' name='name' formik={formik} />
					<FormControl
						label='Email'
						name='email'
						inputType='email'
						formik={formik}
					/>
					<div className='mb-4 '>
						<label htmlFor='' className='inline-block mb-1'>
							Message<span className='text-red-500'>*</span>
						</label>
						<div className='flex'>
							<textarea
								className={`block resize-none px-3 py-2 w-full border-2 border-gray-200 focus:${
									formik.errors.message && formik.touched.message
										? 'border-red'
										: 'border-blue'
								}-500 focus:outline-none`}
								{...formik.getFieldProps('message')}
								required={true}
								rows={5}
							/>
						</div>
						{formik.errors.message && formik.touched.message && (
							<div className='mt-1 text-sm text-red-500'>
								{formik.errors.message}
							</div>
						)}
					</div>
				</form>
			</div>
		</Layout>
	);
};

export default withApollo({ ssr: true })(contact);
