import { Document, Schema } from 'mongoose';
import { Study } from './study.interface';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly birthdate: string;
  readonly roles: Schema.Types.ObjectId[];
  readonly subjects: Schema.Types.ObjectId[];
  readonly avatars: string[];
  readonly skills: Schema.Types.ObjectId[];
  readonly courses: Schema.Types.ObjectId[];
  readonly studies: Study[];
  readonly status: string;
  readonly createdAt: string;
}
