import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  controllers: [AppController, AuthController],
  providers: [AppService, UsersService, PrismaService, AuthService],
  imports: [AuthModule, UsersModule],
})
export class AppModule {}
