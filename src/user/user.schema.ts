import * as Joi from '@hapi/joi';
import { Schema } from 'mongoose';
import {
  COURSE_MODEL,
  ROLE_MODEL,
  SKILL_MODEL,
  SUBJECT_MODEL,
} from '../constants';

export const UserSchema = new Schema(
  {
    avatars: [{ type: String }],
    birthdate: { type: String, required: true },
    email: { type: String, index: true, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    roles: [
      {
        ref: ROLE_MODEL,
        required: true,
        type: Schema.Types.ObjectId,
      },
    ],
    subjects: [
      {
        ref: SUBJECT_MODEL,
        type: Schema.Types.ObjectId,
      },
    ],

    courses: [
      {
        ref: COURSE_MODEL,
        type: Schema.Types.ObjectId,
      },
    ],
    skills: [
      {
        ref: SKILL_MODEL,
        type: Schema.Types.ObjectId,
      },
    ],
    status: { type: String, required: true },
    studies: [{ type: Object }],
  },
  { timestamps: true },
);

export const userValidationSchema = Joi.object({
  birthdate: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  name: Joi.string()
    .min(3)
    .required(),
  password: Joi.string(),
});

export const additionalUserDataValidationSchema = Joi.object({
  courses: Joi.array()
    .items(Joi.string())
    .required(),
  skills: Joi.array()
    .items(Joi.string())
    .required(),
  studies: Joi.array()
    .items(Joi.string())
    .required(),
});
