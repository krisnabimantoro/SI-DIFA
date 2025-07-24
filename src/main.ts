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

  // fix cors sementara :v
  // Allow all origins for development, but restrict in production!
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow all origins (for dev); restrict this in production!
      callback(null, true);
    },
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-csrf-token',
    ],
    exposedHeaders: ['set-cookie'],
  });

  app.useGlobalPipes(new ValidationPipe());
  
  app.use(cookieParser());
  app.use(doubleCsrfProtection);
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
