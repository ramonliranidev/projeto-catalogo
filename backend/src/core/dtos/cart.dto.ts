import { IsInt, IsPositive, IsString } from 'class-validator';

export class CartDto {
  @IsString()
  itemId: string;

  @IsString()
  userId: string;

  @IsString()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class UpdateCartDto extends CartDto {}
