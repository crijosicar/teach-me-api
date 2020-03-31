import { PERMISSION_MODEL } from '@app/constants';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionController } from './permission.controller';
import { PermissionSchema } from './permission.schema';
import { PermissionService } from './permission.service';

@Module({
  controllers: [PermissionController],
  exports: [PermissionService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: PERMISSION_MODEL, schema: PermissionSchema },
    ]),
  ],
  providers: [PermissionService],
})
export class PermissionModule {}
