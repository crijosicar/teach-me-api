import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PERMISSION_MODEL } from 'src/constants';
import { PermissionController } from './permission.controller';
import { PermissionSchema } from './permission.schema';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: PERMISSION_MODEL, schema: PermissionSchema },
    ]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
