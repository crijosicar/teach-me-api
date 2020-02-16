import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SKILL_MODEL } from '../constants';
import { SkillController } from './skill.controller';
import { SkillSchema } from './skill.schema';
import { SkillService } from './skill.service';

@Module({
  controllers: [SkillController],
  exports: [],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: SKILL_MODEL, schema: SkillSchema }]),
  ],
  providers: [SkillService],
})
export class SkillModule {}
