import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { InternService } from '../../intern.service';
import { MealsService } from 'src/services/meals.service';

@Module({
  imports: [],
  controllers: [MenuController],
  providers: [InternService, MealsService, MenuService],
})
export class MenuModule {}
