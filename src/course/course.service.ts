import { COURSE_MODEL } from '@app/constants';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/createCourse.dto';
import { Course } from './interface/course.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(COURSE_MODEL) private readonly courseModel: Model<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async find(id: string): Promise<Course> {
    return this.courseModel.findById(id);
  }

  async findByName(name: string): Promise<Course> {
    return this.courseModel.findOne({ name }).exec();
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);

    return createdCourse.save();
  }
}
