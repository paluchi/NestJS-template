import { Controller, Get, Req } from '@nestjs/common';
import { ProtectedService } from './protected.service';
import { PATH_PREFIX as PARENT_PATH_PREFIX } from '../intern.controller';
import { ApiTags } from '@nestjs/swagger';
import { ProtectedC } from './jwt-auth.guard';

export const PATH_PREFIX = PARENT_PATH_PREFIX;

@ApiTags('Intern protected testing route')
@Controller(PATH_PREFIX)
export class ProtectedController extends ProtectedC {
  constructor(private readonly protectedService: ProtectedService) {
    super();
  }

  @Get()
  getHello(@Req() request): string {
    return `${request.user.username.toUpperCase()}, hello from the protected controller!`;
  }
}
