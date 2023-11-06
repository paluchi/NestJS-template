import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProtectedService {
  constructor(private readonly jwtService: JwtService) {}
}
