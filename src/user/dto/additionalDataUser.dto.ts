import { Course } from 'src/course/interface/course.interface';
import { Skill } from 'src/skill/interface/skill.interface';
import { Study } from '../interface/study.interface';

export interface AdditionalDataUserDto {
  courses: Course[];
  skills: Skill[];
  studies: Study[];
}
