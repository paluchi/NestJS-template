import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InternService } from '../../intern.service';
import { MealsService } from 'src/services/meals.service';

@Injectable()
export class MenuService {
  constructor(
    private readonly internService: InternService,
    private readonly mealsService: MealsService,
  ) {}

  // This service is used to find all the meals of a chef
  findMeals(username: string) {
    return this.mealsService.findChefMeals(username);
  }

  // This service is used to add a new meal to the menu
  async addMeal(username: string, name: string, description: string) {
    // Check if the chef exists
    const chef = await this.internService.findByUsername(username);
    if (!chef) throw new NotFoundException('Chef not found');

    // Check if meal already exists for this chef
    const mealExists = await this.mealsService.findChefMeal(username, name);
    if (mealExists) throw new ConflictException('Meal already exists');

    // Create meal
    return this.mealsService.createMeal(username, name, description);
  }
}
