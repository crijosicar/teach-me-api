import * as Joi from '@hapi/joi';
import * as mongoose from 'mongoose';
import {
  COURSE_MODEL,
  ROLE_MODEL,
  SKILL_MODEL,
  SUBJECT_MODEL,
} from '../constants';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true, select: false },
    birthdate: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ROLE_MODEL,
        required: true,
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SUBJECT_MODEL,
      },
    ],
    avatars: [{ type: String }],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: SKILL_MODEL,
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: COURSE_MODEL,
      },
    ],
    studies: [{ type: Object }],
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const userValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required(),
  password: Joi.string(),
  birthdate: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
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
