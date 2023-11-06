import { Controller } from '@nestjs/common';
import { InternService } from './intern.service';

export const PATH_PREFIX = 'intern';

@Controller(PATH_PREFIX)
export class InternController {
  constructor(private readonly internService: InternService) {}
}
