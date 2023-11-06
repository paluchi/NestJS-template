import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddMealDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the food',
    example: 'Baked potatoes',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'The description of the food',
    example: 'Potatoes that has been baked at 140c for 40 minutes',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class AddMealSuccessfulDto {
  @ApiProperty()
  chef: string;
  @ApiProperty()
  meal: AddMealDto;
}
