import { Injectable } from '@nestjs/common';
import db from 'src/db';

@Injectable()
export class MealsService {
  constructor() {}

  private async calculateMealAvgRating(mealId: number) {
    const ratings = await db.user_meal.findMany({
      where: { meal_id: mealId },
    });
    const sum = ratings.reduce((acc, { rating }) => acc + rating, 0);
    const avg = sum / ratings.length || 0;
    return avg;
  }

  async findChefMeals(username: string, appendRating: boolean = true) {
    // Find all the foods inside the menu
    const meals = await db.meal.findMany({
      where: { chef_username: username },
    });

    const mealsWithRating = (
      await Promise.all(
        meals.map(async (meal) => {
          const rating = appendRating
            ? await this.calculateMealAvgRating(meal.id)
            : undefined;
          return { ...meal, rating };
        }),
      )
    ).map(({ chef_username, ...meal }) => meal);

    return {
      chef: username,
      meals: mealsWithRating,
    };
  }

  async findAllMeals(appendRating: boolean = true) {
    // Find all of the meals
    const meals = await db.meal.findMany();

    // Calculate the average rating to the meal
    const mealsWithRating = await Promise.all(
      meals.map(async (meal) => {
        const rating = appendRating
          ? await this.calculateMealAvgRating(meal.id)
          : undefined;
        return { ...meal, rating };
      }),
    );

    // Order by chef
    const formattedMeals = mealsWithRating.reduce(
      (acc: { [chef: string]: any }, meal) => {
        // Here we keep the chef_username within the mealData object as well
        const mealData = meal; // Now mealData includes 'chef_username'

        // Now we use mealData which includes 'chef_username'
        if (acc[meal.chef_username]) {
          acc[meal.chef_username].push(mealData);
        } else {
          acc[meal.chef_username] = [mealData];
        }
        return acc;
      },
      {},
    );

    return Object.entries(formattedMeals).map(([chef, meals]) => ({
      chef,
      meals,
    }));
  }

  async findMealById(mealId: number, appendRating: boolean = false) {
    // Find the meal by id
    const meal = await db.meal.findUnique({ where: { id: mealId } });
    if (!meal) return null;

    // Calculate the average rating to the meal
    const rating = appendRating
      ? await this.calculateMealAvgRating(meal.id)
      : undefined;

    return { ...meal, rating };
  }

  async findChefMeal(
    username: string,
    name: string,
    appendRating: boolean = false,
  ) {
    // Find the meal by id
    const meal = await db.meal.findFirst({
      where: { name: name, chef_username: username },
    });
    if (!meal) return null;

    // Calculate the average rating to the meal
    const rating = appendRating
      ? await this.calculateMealAvgRating(meal.id)
      : undefined;

    return { ...meal, rating };
  }

  async createMeal(chefUsername: string, name: string, description: string) {
    const meal = await db.meal.create({
      data: {
        chef_username: chefUsername,
        name,
        description,
      },
    });

    return {
      chef: chefUsername,
      meal: {
        id: meal.id,
        name: meal.name,
        description: meal.description,
      },
    };
  }
}
