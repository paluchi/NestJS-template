import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export function createJwtStrategy<Service>(
  secretKey,
  strategyName,
  validationFunction,
) {
  @Injectable()
  class JwtStrategy extends PassportStrategy(Strategy, strategyName) {
    userService;
    constructor(userService: Service) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: secretKey,
      });
      this.userService = userService;
    }

    async validate(payload: any) {
      return validationFunction(payload, this.userService);
    }
  }

  return JwtStrategy;
}
