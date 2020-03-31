import { JoiValidationPipe } from '@app/common/joi-validation.pipe';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isUndefined } from 'lodash';
import { ACTIVE_STATUS } from '../constants';
import { courseValidationSchema } from './course.schema';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { Course } from './interface/course.interface';

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
  @UsePipes(new JoiValidationPipe(courseValidationSchema))
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const courseCreated = await this.courseService.create({
        ...createCourseDto,
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
