import { Document } from 'mongoose';

export interface Role extends Document {
  readonly name: string;
  readonly description: string;
  readonly permissions: string[];
  readonly status: string;
  readonly createdAt: string;
}
