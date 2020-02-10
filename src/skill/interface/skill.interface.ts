import { Document, Schema } from 'mongoose';

export interface Skill extends Document {
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly createdAt: string;
}
