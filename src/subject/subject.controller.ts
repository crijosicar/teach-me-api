import { JoiValidationPipe } from '@app/common/joi-validation.pipe';
import { ACTIVE_STATUS } from '@app/constants';
import { EducationalLevelService } from '@app/educational-level/educational-level.service';
import { Role } from '@app/role/interface/role.interface';
import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { compact, isUndefined, map } from 'lodash';
import { AddEduLevelSubjectDto } from './dto/addEduLevelSubject.dto';
import { CreateSubjectDto } from './dto/createSubject.dto';
import { Subject } from './interface/subject.interface';
import { eduLevelsValidationSchema } from './subject.schema';
import { subjectValidationSchema } from './subject.schema';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseInterceptors(CacheInterceptor)
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly educationalLevelService: EducationalLevelService,
  ) {}

  @Get()
  async findAll(): Promise<Subject[]> {
    return this.subjectService.findAll();
  }

  @Post()
  @UsePipes(new JoiValidationPipe(subjectValidationSchema))
  async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
      return this.subjectService.create({
        ...createSubjectDto,
        status: ACTIVE_STATUS,
      });
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/educational-levels')
  async addEducationalLevelSubject(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(eduLevelsValidationSchema))
    addEduLevelSubjectDto: AddEduLevelSubjectDto,
  ): Promise<Role> {
    try {
      const subject = await this.subjectService.find(id);

      if (!subject) throw new Error('Not valid Subject provided');

      const { educationalLevels } = addEduLevelSubjectDto;
      const educationalLevelsResolved = await Promise.all(
        educationalLevels.map((educationalLevel: string) =>
          this.educationalLevelService.find(educationalLevel),
        ),
      );
      const compactedEducationalLevels = compact(educationalLevelsResolved);

      if (!compactedEducationalLevels.length)
        throw new Error('Not valid Educational Levels provided');

      const educationalLevelsIds = map(compactedEducationalLevels, '_id');

      return this.subjectService.addEducationalLevelsSubject(
        id,
        educationalLevelsIds,
      );
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
