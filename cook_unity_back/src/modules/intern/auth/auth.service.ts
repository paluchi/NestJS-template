import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import env from 'src/utils/env';
import { InternService } from '../intern.service';
import generateJwt from 'src/authGateways/jwt/utils/generateJwt';

@Injectable()
export class AuthService {
  constructor(private readonly internService: InternService) {}

  // This service is used to register a new intern
  async register(username: string, password: string): Promise<void> {
    // Check if user already exists
    const existingUser = await this.internService.findByUsername(username);
    if (existingUser) throw new ConflictException('Username already taken');

    // Generate hash and salt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    this.internService.store(username, hashedPassword, salt);
  }

  // This service is used to log in a n intern
  async logIn(username: string, password: string): Promise<{ token: string }> {
    const user = await this.internService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = generateJwt(env.JWT_KEY_INTERNS, {
      username: user.username,
      type: 'platform_intern',
    });

    return { token };
  }
}
