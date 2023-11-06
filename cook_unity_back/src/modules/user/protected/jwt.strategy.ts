import { UnauthorizedException } from '@nestjs/common';
import { createJwtStrategy } from 'src/authGateways/jwt/jwt.strategy.factory';
import env from 'src/utils/env';
import { UserService } from '../user.service';

// Passport will automatically call this method for you when validating a token
async function validate(payload: any, userService: UserService) {
  const user = await userService.findByUsername(payload.username);
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
}

export const JwtStrategy = createJwtStrategy<UserService>(
  env.JWT_KEY_USERS,
  'user_jwt',
  validate,
);
