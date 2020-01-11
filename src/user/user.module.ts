import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from 'src/role/role.schema';
import { RoleService } from 'src/role/role.service';
import { ROLE_MODEL, USER_MODEL } from '../constants';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: ROLE_MODEL, schema: RoleSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
