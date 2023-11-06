import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let subscriptionsService: SubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {
            findMeals: jest.fn(),
            rateMeal: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    subscriptionsService =
      module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSubscribedMeals', () => {
    it('should return a list of subscribed meals', async () => {
      const result = [
        {
          chef: 'ChefA',
          meals: [
            { id: 1, name: 'Pizza', rating: 5 },
            // ... other meals
          ],
        },
        {
          chef: 'ChefB',
          meals: [
            { id: 2, name: 'Sushi', rating: 4 },
            // ... other meals
          ],
        },
        // ... other chefs and their meals
      ];
      jest.spyOn(subscriptionsService, 'findMeals').mockResolvedValue(result);

      const mockRequest = { user: { username: 'testUser' } };
      expect(await controller.getSubscribedMeals(mockRequest)).toEqual(result);
    });

    // Add more tests for error scenarios or edge cases if necessary
  });

  describe('rateSubscribedMeal', () => {
    it('should update the meal rating successfully', async () => {
      const rateMealDto = { mealId: 1, rating: 4 };
      jest
        .spyOn(subscriptionsService, 'rateMeal')
        .mockImplementation(async () => undefined);

      const mockRequest = { user: { username: 'testUser' } };
      const response = await controller.rateSubscribedMeal(
        mockRequest,
        rateMealDto,
      );

      expect(response).toBeUndefined();
      expect(subscriptionsService.rateMeal).toHaveBeenCalledWith(
        'testUser',
        rateMealDto.mealId,
        rateMealDto.rating,
      );
    });

    it('should throw NotFoundException if meal does not exist', async () => {
      const rateMealDto = { mealId: 999, rating: 4 };
      jest
        .spyOn(subscriptionsService, 'rateMeal')
        .mockImplementation(async () => {
          throw new NotFoundException('Meal not found');
        });

      const mockRequest = { user: { username: 'testUser' } };

      await expect(
        controller.rateSubscribedMeal(mockRequest, rateMealDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if rating is invalid', async () => {
      const rateMealDto = { mealId: 1, rating: 6 }; // Invalid rating
      jest
        .spyOn(subscriptionsService, 'rateMeal')
        .mockImplementation(async () => {
          throw new ConflictException(
            'Invalid rating value; must be between 1 and 5',
          );
        });

      const mockRequest = { user: { username: 'testUser' } };

      await expect(
        controller.rateSubscribedMeal(mockRequest, rateMealDto),
      ).rejects.toThrow(ConflictException);
    });

    // Add more tests for error scenarios or edge cases if necessary
  });

  // Additional tests can go here
});
