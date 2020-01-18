import { Document, Schema } from 'mongoose';

export interface Role extends Document {
  readonly name: string;
  readonly description: string;
  readonly permissions?: Schema.Types.ObjectId[];
  readonly status: string;
  readonly createdAt: string;
}
