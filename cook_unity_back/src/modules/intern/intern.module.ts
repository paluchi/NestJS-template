import { Module } from '@nestjs/common';
import { InternService } from './intern.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected/protected.module';

@Module({
  imports: [AuthModule, ProtectedModule],
  controllers: [],
  providers: [InternService],
})
export class InternModule {}
