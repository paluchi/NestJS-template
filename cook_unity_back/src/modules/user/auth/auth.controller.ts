import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PATH_PREFIX as PARENT_PATH_PREFIX } from '../user.controller';
import { RegisterDto } from './DTOs/register.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LogInDto, SuccessfullLogInDto } from './DTOs/logIn.dto';

export const PATH_PREFIX = `${PARENT_PATH_PREFIX}/auth`;

@ApiTags('Users auth')
@Controller(PATH_PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Successfully registered a new user' })
  @ApiConflictResponse({
    description: 'Username already taken',
  })
  @ApiOperation({ summary: 'Register as a user' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    const { username, password } = registerDto;
    await this.authService.register(username, password);
  }

  @ApiResponse({
    status: 201,
    description: 'Successfully logged in',
    type: SuccessfullLogInDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiOperation({ summary: 'Login as a user' })
  @Post('login')
  async logIn(@Body() logInDto: LogInDto): Promise<{ jwt: string }> {
    const { username, password } = logInDto;
    const { token } = await this.authService.logIn(username, password);

    return { jwt: token };
  }
}
