import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ROLE_MODEL } from '../constants';
import { RoleController } from './role.controller';
import { RoleSchema } from './role.schema';
import { RoleService } from './role.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: ROLE_MODEL, schema: RoleSchema }]),
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
