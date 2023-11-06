import { UnauthorizedException } from '@nestjs/common';
import { createJwtStrategy } from 'src/authGateways/jwt/jwt.strategy.factory';
import env from 'src/utils/env';
import { InternService } from '../intern.service';

// Passport will automatically call this method for you when validating a token
async function validate(payload: any, internService: InternService) {
  const user = await internService.findByUsername(payload.username);
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
}

export const JwtStrategy = createJwtStrategy<InternService>(
  env.JWT_KEY_INTERNS,
  'intern_jwt',
  validate,
);
