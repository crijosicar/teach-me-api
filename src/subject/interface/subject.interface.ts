import { Document, Schema } from 'mongoose';

export interface Subject extends Document {
  readonly name: string;
  readonly description: string;
  readonly educationalLevels?: Schema.Types.ObjectId[];
  readonly status: string;
  readonly createdAt: string;
}
