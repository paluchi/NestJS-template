import { Module } from '@nestjs/common';
import { ProtectedService } from './protected.service';
import { ProtectedController } from './protected.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import env from 'src/utils/env';
import { UserService } from '../user.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { JwtStrategy } from './jwt.strategy';

// ProtectedModule is the root module of the protected subModule, It confifgures and provides auth services to the underlying controllers
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_KEY_USERS,
    }),
    SubscriptionsModule,
  ],
  controllers: [ProtectedController],
  providers: [
    UserService,
    ProtectedService,
    {
      provide: JwtStrategy,
      useFactory: (userService: UserService) => {
        return new JwtStrategy(userService);
      },
      inject: [UserService],
    },
  ],
})
export class ProtectedModule {}
