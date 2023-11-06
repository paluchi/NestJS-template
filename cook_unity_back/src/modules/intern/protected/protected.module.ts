import { Module } from '@nestjs/common';
import { ProtectedService } from './protected.service';
import { ProtectedController } from './protected.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import env from 'src/utils/env';
import { InternService } from '../intern.service';
import { MenuModule } from './menu/menu.module';
import { JwtStrategy } from './jwt.strategy';

// ProtectedModule is the root module of the protected subModule, It confifgures and provides auth services to the underlying controllers
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_KEY_INTERNS,
    }),
    MenuModule,
  ],
  controllers: [ProtectedController],
  providers: [
    InternService,
    ProtectedService,
    {
      provide: JwtStrategy,
      useFactory: (internService: InternService) => {
        return new JwtStrategy(internService);
      },
      inject: [InternService],
    },
  ],
})
export class ProtectedModule {}
