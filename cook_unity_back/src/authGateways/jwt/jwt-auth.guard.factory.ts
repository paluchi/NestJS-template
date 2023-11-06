import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This function creates a new class that extends AuthGuard with the given strategy name
export function createJwtAuthGuard(
  strategyName: string,
  canActivateFn?: (context: ExecutionContext) => boolean,
) {
  @Injectable()
  class JwtAuthGuard extends AuthGuard(strategyName) {
    canActivate(context: ExecutionContext) {
      // Add your custom authentication logic here
      const canActivate = canActivateFn && canActivateFn(context);
      if (canActivateFn && !canActivate) return false;

      return super.canActivate(context);
    }

    handleRequest(err, user, info) {
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user;
    }
  }

  return JwtAuthGuard;
}
