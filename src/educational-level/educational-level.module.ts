import { EDUCATIONAL_LEVEL_MODEL } from '@app/constants';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationalLevelController } from './educational-level.controller';
import { EducationalLevelSchema } from './educational-level.schema';
import { EducationalLevelService } from './educational-level.service';

@Module({
  controllers: [EducationalLevelController],
  exports: [EducationalLevelService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: EDUCATIONAL_LEVEL_MODEL, schema: EducationalLevelSchema },
    ]),
  ],
  providers: [EducationalLevelService],
})
export class EducationalLevelModule {}
