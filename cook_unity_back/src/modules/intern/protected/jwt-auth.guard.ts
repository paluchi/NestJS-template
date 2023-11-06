import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createJwtAuthGuard } from 'src/authGateways/jwt/jwt-auth.guard.factory';

export const JwtAuthGuard = createJwtAuthGuard('intern_jwt');

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ProtectedC {}
