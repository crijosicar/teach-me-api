import { Document } from 'mongoose';

export interface Certification extends Document {
  name: string;
  url: string;
}
