import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class RateMealDto {
  @ApiProperty({
    example: 1,
    description: 'The password of the User',
  })
  @IsNumber()
  @IsNotEmpty()
  mealId: number;

  @ApiProperty({
    example: 3,
    description: 'Rate given to the meal',
  })
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
