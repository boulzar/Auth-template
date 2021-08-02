import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import { FieldError } from './common';

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;

	@Field(() => String, { nullable: true })
	message?: string;

	@Field(() => String, { nullable: true })
	accessToken?: string;
}

@InputType()
export class RegisterInput {
	@Field()
	name: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class LoginInput {
	@Field()
	email: string;

	@Field()
	password: string;
}
