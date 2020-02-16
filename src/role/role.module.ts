import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from 'src/permission/permission.schema';
import { PermissionService } from 'src/permission/permission.service';
import { PERMISSION_MODEL, ROLE_MODEL } from '../constants';
import { RoleController } from './role.controller';
import { RoleSchema } from './role.schema';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  exports: [RoleService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: ROLE_MODEL, schema: RoleSchema },
      { name: PERMISSION_MODEL, schema: PermissionSchema },
    ]),
  ],
  providers: [RoleService, PermissionService],
})
export class RoleModule {}
