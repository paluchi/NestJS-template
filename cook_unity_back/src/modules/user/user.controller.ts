import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

export const PATH_PREFIX = 'user';

@Controller(PATH_PREFIX)
export class UserController {
  constructor(private readonly userService: UserService) {}
}
