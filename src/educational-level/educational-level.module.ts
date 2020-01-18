import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EDUCATIONAL_LEVEL_MODEL } from '../constants';
import { EducationalLevelController } from './educational-level.controller';
import { EducationalLevelSchema } from './educational-level.schema';
import { EducationalLevelService } from './educational-level.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: EDUCATIONAL_LEVEL_MODEL, schema: EducationalLevelSchema },
    ]),
  ],
  controllers: [EducationalLevelController],
  providers: [EducationalLevelService],
  exports: [EducationalLevelService],
})
export class EducationalLevelModule {}
