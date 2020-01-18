import { Document } from 'mongoose';
import { Role } from 'src/role/role.interface';
import { Subject } from 'src/subject/subject.interface';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly birthdate: string;
  readonly roles: Role[];
  readonly subjects: Subject[];
  readonly status: string;
  readonly createdAt: string;
}
