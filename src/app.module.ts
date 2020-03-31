import { AuthModule } from '@app/auth/auth.module';
import { CourseModule } from '@app/course/course.module';
import { EducationalLevelModule } from '@app/educational-level/educational-level.module';
import { CheckIdMiddleware } from '@app/middleware/check-id.middleware';
import { PermissionModule } from '@app/permission/permission.module';
import { RoleModule } from '@app/role/role.module';
import { SkillModule } from '@app/skill/skill.module';
import { SubjectModule } from '@app/subject/subject.module';
import { UserModule } from '@app/user/user.module';
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

const { DATABASE_HOST } = process.env;

@Module({
  controllers: [AppController],
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
    EducationalLevelModule,
    SkillModule,
    CourseModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckIdMiddleware)
      .forRoutes({ path: 'role/:id/permissions', method: RequestMethod.POST });
  }
}
