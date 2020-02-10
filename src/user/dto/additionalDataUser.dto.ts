import { Course } from 'src/course/interface/course.interface';
import { Skill } from 'src/skill/interface/skill.interface';
import { Study } from '../interface/user.interface';

export interface AdditionalDataUserDto {
  courses: Course[];
  skills: Skill[];
  studies: Study[];
}
