import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { ProtectedModule } from './protected/protected.module';

// UserModule is the root module of the users subModule, it's empty because we don't need to add any configuration to it.
@Module({
  imports: [AuthModule, ProtectedModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
