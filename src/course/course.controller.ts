import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isUndefined } from 'lodash';
import { ACTIVE_STATUS } from '../constants';
import { Course } from './course.interface';
import { courseValidationSchema } from './course.schema';
import { CourseService } from './course.service';
import { CreateCourseDto } from './createCourse.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: string): Promise<Course> {
    return this.courseService.find(id);
  }

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      await courseValidationSchema.validateAsync(createCourseDto);

      const createdAt = new Date().valueOf().toString();
      const courseCreated = await this.courseService.create({
        ...createCourseDto,
        createdAt,
        status: ACTIVE_STATUS,
      });

      return courseCreated;
    } catch (error) {
      const message = isUndefined(error.response)
        ? error.message
        : error.response.data;
      const statusCode = isUndefined(error.response)
        ? HttpStatus.INTERNAL_SERVER_ERROR
        : error.response.status;
      throw new HttpException(message, statusCode);
    }
  }
}
