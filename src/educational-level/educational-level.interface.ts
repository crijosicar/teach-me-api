import { Document } from 'mongoose';

export interface EducationalLevel extends Document {
  readonly name: string;
  readonly description: string;
  readonly status: string;
  readonly createdAt: string;
}
