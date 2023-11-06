import * as NestCommons from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PATH_PREFIX as PARENT_PATH_PREFIX } from '../protected.controller';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProtectedC } from '../jwt-auth.guard';
import { RateMealDto } from './DTOs/rateMeal.dto';

export const PATH_PREFIX = `${PARENT_PATH_PREFIX}/subscriptions`;

@ApiTags('user subscriptions')
@NestCommons.Controller(PATH_PREFIX)
export class SubscriptionsController extends ProtectedC {
  constructor(private readonly subscriptionsService: SubscriptionsService) {
    super();
  }

  @NestCommons.Get('meals')
  @ApiOperation({ summary: 'Get all subscribed meals' })
  getSubscribedMeals(@NestCommons.Req() request): any {
    const { user } = request;
    return this.subscriptionsService.findMeals(user.username);
  }

  @NestCommons.Put('rate_meal')
  @ApiOperation({ summary: 'Rate a subscribed meal' })
  @ApiResponse({
    status: NestCommons.HttpStatus.OK,
    description: 'The rating has been updated successfully',
  })
  @ApiResponse({
    status: NestCommons.HttpStatus.NOT_FOUND,
    description: 'Meal not found',
  })
  @ApiResponse({
    status: NestCommons.HttpStatus.CONFLICT,
    description: 'Invalid rating value; must be between 1 and 5',
  })
  @ApiResponse({
    status: NestCommons.HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async rateSubscribedMeal(
    @NestCommons.Req() request,
    @NestCommons.Body() rateMealDto: RateMealDto,
  ): Promise<any> {
    // Make sure to import and use the correct DTO
    const { user } = request;
    const { mealId, rating } = rateMealDto;
    return this.subscriptionsService.rateMeal(user.username, mealId, rating);
  }
}
