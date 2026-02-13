import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RolesGuard } from './guards/roles.guard';
import { Reflector } from '@nestjs/core';
import * as csurf from 'csurf';
import fastifyCsrf from '@fastify/csrf-protection';

import { doubleCsrf } from 'csrf-csrf';
import { doubleCsrfProtection } from './middleware/csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://local-fe.sidifa.my.id','https://sidifa.my.id', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.use(doubleCsrfProtection);
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
