import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly birthdate: string;
  readonly status: string;
  readonly createdAt: string;
}
