import { Course } from 'src/course/course.interface';
import { Skill } from 'src/skill/skill.interface';
import { Study } from './user.interface';

export interface AdditionalDataUserDto {
  courses: Course[];
  skills: Skill[];
  studies: Study[];
}
