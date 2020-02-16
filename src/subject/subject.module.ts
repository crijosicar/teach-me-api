import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EDUCATIONAL_LEVEL_MODEL, SUBJECT_MODEL } from 'src/constants';
import { EducationalLevelSchema } from 'src/educational-level/educational-level.schema';
import { EducationalLevelService } from 'src/educational-level/educational-level.service';
import { SubjectController } from './subject.controller';
import { SubjectSchema } from './subject.schema';
import { SubjectService } from './subject.service';

@Module({
  controllers: [SubjectController],
  exports: [SubjectService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SUBJECT_MODEL, schema: SubjectSchema },
      { name: EDUCATIONAL_LEVEL_MODEL, schema: EducationalLevelSchema },
    ]),
    CacheModule.register(),
  ],
  providers: [SubjectService, EducationalLevelService],
})
export class SubjectModule {}
