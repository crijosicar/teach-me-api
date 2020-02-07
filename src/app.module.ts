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
import { CourseModule } from './course/course.module';
import { EducationalLevelModule } from './educational-level/educational-level.module';
import { CheckIdMiddleware } from './middleware/check-id.middleware';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { SkillModule } from './skill/skill.module';
import { SubjectModule } from './subject/subject.module';
import { UserModule } from './user/user.module';

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
