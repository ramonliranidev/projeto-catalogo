import { CartDto, UpdateCartDto } from '@core/dtos/cart.dto';
import { Body, Controller, Delete, Patch, Post, Query } from '@nestjs/common';
import { CartUseCase } from '@use-cases/cart/cart.use-case';

@Controller('cart')
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  // Adiciona um item ao carrinho
  @Post('add')
  async addToCart(@Body() cartDto: CartDto) {
    return this.cartUseCase.addToCart(cartDto);
  }

  // Atualiza a quantidade de um item no carrinho
  @Patch('update')
  async updateCart(@Body() updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;
    return this.cartUseCase.updateCart(userId, productId, quantity);
  }

  // Remove um item específico do carrinho
  @Delete('remove')
  async removeFromCart(
    @Query('userId') userId: string,
    @Query('productId') productId: string,
  ) {
    return this.cartUseCase.removeCart(userId, productId);
  }
}
