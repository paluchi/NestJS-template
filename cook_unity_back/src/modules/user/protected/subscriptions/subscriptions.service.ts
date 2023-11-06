import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import db from 'src/db';
import { MealsService } from 'src/services/meals.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly mealsService: MealsService) {}

  // For sake of simplicity subscriptions are just all existing meals
  async findMeals(username: string) {
    const chefsMeals = await this.mealsService.findAllMeals();

    return Promise.all(
      chefsMeals.map(async (chefMeals) => {
        // Destructure to extract `meals` and any other properties `chefMeals` might have
        const { meals, ...chefInfo } = chefMeals;

        // Process each meal to update its rating if there's a user-specific rating
        const mealsWithRating = await Promise.all(
          (meals as any).map(async (meal) => {
            const userMeal = await db.user_meal.findFirst({
              where: { user_username: username, meal_id: meal.id },
            });

            // Return meal with possibly updated rating
            return { ...meal, rating: userMeal?.rating || undefined };
          }),
        );

        // Return the updated chefMeals with the modified meals
        return { ...chefInfo, meals: mealsWithRating };
      }),
    );
  }

  async rateMeal(username: string, mealId: number, rating: number) {
    const meal = await this.mealsService.findMealById(mealId);
    if (!meal) throw new NotFoundException('Meal not found');

    // Check if the rating is valid (between 1 and 5)
    if (rating < 1 || rating > 5)
      throw new ConflictException('Rating must be between 1 and 5');

    // Check if user_meal already exists to overwrite the rating
    const userMeal = await db.user_meal.findFirst({
      where: { user_username: username, meal_id: mealId },
    });

    if (!userMeal)
      // Create a new user_meal entry with the rating
      await db.user_meal.create({
        data: {
          user_username: username,
          meal_id: mealId,
          rating,
        },
      });
    else {
      // Update the rating
      await db.user_meal.update({
        where: { id: userMeal.id },
        data: { rating },
      });
    }
  }
}
