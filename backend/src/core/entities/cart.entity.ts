import { CartItem } from './cart-item.entity';

export class Cart {
  id: string;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
