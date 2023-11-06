import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the User' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'myPass123',
    description: 'The password of the User',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SuccessfullLogInDto {
  @ApiProperty()
  jwt: string;

}
