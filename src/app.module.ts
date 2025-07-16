import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { CsrfController } from './csrf/csrf.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  controllers: [AppController, AuthController, AdminController, CsrfController],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    AuthService,
    MailService,
    ConfigService,
    AdminService,
  ],
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'uploads'), //  for build
      rootPath: join(process.cwd(), 'uploads'),
      // exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
      },
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 5000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    MailModule,
    AdminModule,
  ],
})
export class AppModule {}
