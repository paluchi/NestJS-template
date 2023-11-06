import * as NestCommons from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { PATH_PREFIX as PARENT_PATH_PREFIX } from '../protected.controller';
import { AddMealDto, AddMealSuccessfulDto } from './DTOs/addMenuMeal';
import { ProtectedC } from '../jwt-auth.guard';

export const PATH_PREFIX = `${PARENT_PATH_PREFIX}/menu`;

@ApiTags('Intern menu')
@NestCommons.Controller(PATH_PREFIX)
export class MenuController extends ProtectedC {
  constructor(private readonly menuService: MenuService) {
    super();
  }

  @NestCommons.Get()
  @ApiOperation({ summary: 'Get current menu by username' })
  @ApiResponse({ status: 200, description: 'Returns the current menu.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })

  // This service is used to find all the meals of a chef
  async getCurrentMeals(@NestCommons.Req() request) {
    const { user } = request;
    const menu = await this.menuService.findMeals(user.username);
    if (!menu) throw new NestCommons.NotFoundException('Menu not found');

    return menu;
  }

  @NestCommons.Put()
  @ApiOperation({ summary: 'Add a new meal to the menu' })
  @ApiBody({ type: AddMealDto })
  @ApiResponse({
    status: 200,
    description: 'Meal added successfully to the menu.',
    type: AddMealSuccessfulDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 409,
    description: 'Meal already exists',
  })

  // This service is used to add a new meal to the menu
  async addMeal(
    @NestCommons.Req() request,
    @NestCommons.Body() addMealDto: AddMealDto,
  ) {
    const { user } = request;
    const { name, description } = addMealDto;
    return await this.menuService.addMeal(user.username, name, description);
  }
}
