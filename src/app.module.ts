import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CheckIdMiddleware } from './middleware/checkId.middleware';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';

const { DATABASE_HOST } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    SubjectModule,
    UserModule,
    ScheduleModule.forRoot(),
    CacheModule.register(),
    MongooseModule.forRoot(DATABASE_HOST!),
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckIdMiddleware)
      .forRoutes({ path: 'role/:id/permissions', method: RequestMethod.POST });
  }
}
