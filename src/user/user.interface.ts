import { Document, Schema } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly birthdate: string;
  readonly roles: Schema.Types.ObjectId[];
  readonly subjects: Schema.Types.ObjectId[];
  readonly status: string;
  readonly createdAt: string;
}
