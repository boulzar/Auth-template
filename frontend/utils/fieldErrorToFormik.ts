import { FormikErrors } from 'formik';
import { FieldError } from '../generated/graphql';

export const fieldErrorToFormik = (errors: FieldError[]) => {
	let temp: FormikErrors<any> = {};
	errors.forEach((err) => {
		temp[err.field] = err.message;
	});
	return temp;
};
