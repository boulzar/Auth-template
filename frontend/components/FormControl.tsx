import { FormikProps } from 'formik';
import React from 'react';

interface FormControlProps {
	formik: FormikProps<any>;
	name: string;
	label: string;
	helperText?: React.ReactNode;
	inputType?: string;
	required?: boolean;
	append?: React.ReactNode;
	prepend?: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({
	formik,
	name,
	label,
	helperText,
	inputType,
	required,
	append,
	prepend,
}) => {
	return (
		<div className='mb-4 '>
			<label htmlFor='' className='inline-block mb-1'>
				{label}
				{required && <span className='text-red-500'>*</span>}
			</label>
			<div className='flex'>
				{prepend && (
					<div className='flex items-center justify-center px-2 bg-gray-200 rounded-l'>
						{prepend}
					</div>
				)}
				<input
					type={inputType}
					className={`block px-3 py-2 w-full ${
						append
							? prepend
								? ''
								: 'rounded-l'
							: prepend
							? 'rounded-r'
							: 'rounded'
					} border-2 border-gray-200 focus:${
						formik.errors[name] && formik.touched[name]
							? 'border-red'
							: 'border-blue'
					}-500 focus:outline-none`}
					{...formik.getFieldProps(name)}
					required={required}
				/>
				{append && (
					<div className='flex items-center justify-center px-2 bg-gray-200 rounded-r'>
						{append}
					</div>
				)}
			</div>
			{formik.errors[name] && formik.touched[name] && (
				<div className='mt-1 text-sm text-red-500'>{formik.errors[name]}</div>
			)}
			<div className='mt-1 text-sm text-gray-500'>{helperText}</div>
		</div>
	);
};

FormControl.defaultProps = {
	inputType: 'text',
	required: false,
};

export default FormControl;
