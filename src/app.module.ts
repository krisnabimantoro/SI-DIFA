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

@Module({
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    UsersService,
    PrismaService,
    AuthService,
    MailService,
    ConfigService,
  ],
  imports: [
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
  ],
})
export class AppModule {}
