import { CartDto } from '@core/dtos/cart.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CartUseCase {
  constructor(private prismaService: PrismaService) {}

  async addToCart(cartDto: CartDto) {
    const { userId, productId, quantity } = cartDto;

    // Tenta encontrar o carrinho existente do usuário
    let cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      // Cria um novo carrinho se não existir
      cart = await this.prismaService.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Continua o processo com o carrinho encontrado ou recém-criado
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Atualiza a quantidade do item existente
      return this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Adiciona um novo item ao carrinho
      return this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  async removeCart(userId: string, productId: string): Promise<void> {
    // Busca o carrinho do usuário pelo userId
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado.');
    }

    // Encontra o item específico no carrinho
    const itemToRemove = cart.items.find((item) => item.productId === productId);

    if (!itemToRemove) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    // Remove o item do carrinho
    await this.prismaService.cartItem.delete({
      where: { id: itemToRemove.id },
    });
  }

  async updateCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<void> {
    // Verifica se a quantidade é válida
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }

    // Busca o carrinho do usuário pelo userId
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado.');
    }

    // Encontra o item específico no carrinho
    const itemToUpdate = cart.items.find((item) => item.productId === productId);

    if (!itemToUpdate) {
      throw new NotFoundException('Item não encontrado no carrinho.');
    }

    // Atualiza a quantidade do item no carrinho
    await this.prismaService.cartItem.update({
      where: { id: itemToUpdate.id },
      data: { quantity },
    });
  }
}
