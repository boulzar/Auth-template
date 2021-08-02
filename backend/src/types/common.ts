import { Request, Response } from 'express';
import { Field, ObjectType } from 'type-graphql';

export type ApiContext = {
	req: Request;
	res: Response;
	payload?: { userId: string };
};

@ObjectType()
export class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}
