import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { InternService } from '../intern.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, InternService],
})
export class AuthModule {}
