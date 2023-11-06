import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

describe('MenuController', () => {
  let menuController: MenuController;
  let menuService: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: {
            findMeals: jest.fn(),
            addMeal: jest.fn(),
          },
        },
      ],
    }).compile();

    menuController = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
  });

  describe('getCurrentMeals', () => {
    it('should return the current menu', async () => {
      // Mock the expected return structure based on the error message
      const result = {
        chef: 'testChef',
        meals: [
          {
            rating: 5,
            id: 1,
            name: 'Test Meal',
            description: 'Test Description',
            created_at: new Date(),
          },
          // ... other meals
        ],
      };

      jest.spyOn(menuService, 'findMeals').mockResolvedValue(result);
      expect(
        await menuController.getCurrentMeals({ user: { username: 'test' } }),
      ).toBe(result);
    });

    it('should throw NotFoundException if the menu is not found', async () => {
      jest.spyOn(menuService, 'findMeals').mockResolvedValue(null);
      await expect(
        menuController.getCurrentMeals({ user: { username: 'test' } }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMeal', () => {
    it('should add a new meal to the menu', async () => {
      const mealDto = { name: 'New Meal', description: 'Delicious' };
      jest.spyOn(menuService, 'addMeal').mockResolvedValue(undefined); // Assume it returns nothing on success
      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException if the chef is not found', async () => {
      const mealDto = { name: 'New Meal', description: 'Delicious' };
      jest
        .spyOn(menuService, 'addMeal')
        .mockRejectedValue(new NotFoundException('Chef not found'));
      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if the meal already exists', async () => {
      const mealDto = { name: 'New Meal', description: 'Delicious' };
      jest
        .spyOn(menuService, 'addMeal')
        .mockRejectedValue(new ConflictException('Meal already exists'));
      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if the meal name is empty', async () => {
      const mealDto = { name: '', description: 'Delicious' };
      // This is assuming that your controller/service throws a BadRequestException for invalid input
      jest
        .spyOn(menuService, 'addMeal')
        .mockRejectedValue(new BadRequestException('Name should not be empty'));

      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the meal description is empty', async () => {
      const mealDto = { name: 'New Meal', description: '' };
      jest
        .spyOn(menuService, 'addMeal')
        .mockRejectedValue(
          new BadRequestException('Description should not be empty'),
        );

      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the meal name is too long', async () => {
      // Assuming there is a character limit for the name
      const mealDto = {
        name: 'This is a very long name that should fail validation because it exceeds the maximum allowed length',
        description: 'Delicious',
      };
      jest
        .spyOn(menuService, 'addMeal')
        .mockRejectedValue(new BadRequestException('Name is too long'));

      await expect(
        menuController.addMeal({ user: { username: 'chef' } }, mealDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('auth guard', () => {
    it('should throw UnauthorizedException if JWT is expired', async () => {
      // Simulate the JWT expired scenario
      jest.spyOn(menuService, 'findMeals').mockImplementation(() => {
        throw new UnauthorizedException('Unauthorized, JWT expired');
      });

      await expect(
        menuController.getCurrentMeals({ user: { username: 'test' } }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if JWT is invalid', async () => {
      // Simulate the invalid JWT scenario
      jest.spyOn(menuService, 'findMeals').mockImplementation(() => {
        throw new UnauthorizedException('Unauthorized, invalid JWT');
      });

      await expect(
        menuController.getCurrentMeals({ user: { username: 'test' } }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // Additional tests can be written here for other controller methods
});
