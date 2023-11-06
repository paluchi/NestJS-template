import { Module } from '@nestjs/common';
import { InternModule } from './intern/intern.module';
import { UserModule } from './user/user.module';

// AppModule is the root module of the application, it's empty because we don't need to add any configuration to it.
@Module({
  imports: [InternModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
