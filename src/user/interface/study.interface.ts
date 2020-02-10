import { Document } from 'mongoose';
import { Certification } from './certification.interface';

export interface Study extends Document {
  name: string;
  description: string;
  since: number;
  until: number;
  certifications: Certification[];
  status: string;
}
