import { Document } from 'mongoose';

export interface Subject extends Document {
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly createdAt: string;
}
