import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user.service';
import generateJwt from 'src/authGateways/jwt/utils/generateJwt';
import env from 'src/utils/env';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(username: string, password: string): Promise<void> {
    // Check if user already exists
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) throw new ConflictException('Username already taken');

    // Generate hash and salt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    this.userService.store(username, hashedPassword, salt);
  }

  async logIn(username: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.hash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = generateJwt(env.JWT_KEY_USERS, {
      username: user.username,
      type: 'platform_user',
    });

    return { token };
  }
}
