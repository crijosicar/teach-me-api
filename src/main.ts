import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });

  app.use(helmet());
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('Subject example')
    .setDescription('The subjects API description')
    .setVersion('1.0')
    .addTag('subjects')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
