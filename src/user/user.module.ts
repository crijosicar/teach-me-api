import { ROLE_MODEL, USER_MODEL } from '@app/constants';
import { RoleSchema } from '@app/role/role.schema';
import { RoleService } from '@app/role/role.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema },
      { name: ROLE_MODEL, schema: RoleSchema },
    ]),
    MulterModule.register(),
  ],
  providers: [UserService, RoleService],
})
export class UserModule {}
