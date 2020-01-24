import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { COURSE_MODEL } from '../constants';
import { CourseController } from './course.controller';
import { CourseSchema } from './course.schema';
import { CourseService } from './course.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: COURSE_MODEL, schema: CourseSchema }]),
  ],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [],
})
export class CourseModule {}
