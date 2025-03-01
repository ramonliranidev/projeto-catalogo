import { Injectable } from '@nestjs/common';
import { get, omit } from 'lodash';

import { CreateProductDto, UpdateProductDto } from '@core/dtos/product.dto';
import { IBaseFactory } from '@core/entities/base-factory.entity';
import { Product } from '@core/entities/product.entity';

@Injectable()
export class ProductFactoryService
  implements IBaseFactory<Product, CreateProductDto, UpdateProductDto>
{
  create(createProductDto: CreateProductDto) {
    const newProduct = new Product();
    newProduct.name = createProductDto.name;
    newProduct.price = createProductDto.price;
    newProduct.discount = createProductDto.discount;
    newProduct.color = createProductDto.color;
    newProduct.size = createProductDto.size;
    newProduct.shortDescription = createProductDto.shortDescription;
    newProduct.description = createProductDto.description;
    newProduct.productCategoryId = createProductDto.productCategoryId;
    newProduct.imageUrl = createProductDto.imageUrl;
    newProduct.active = get(createProductDto, 'active', true);
    newProduct.launches = get(createProductDto, 'launches', false);
    newProduct.bestSeller = get(createProductDto, 'bestSeller', false);
    newProduct.subcategories = createProductDto.subcategories;

    return newProduct;
  }

  update(updateProductDto: UpdateProductDto) {
    const updateProduct = new Product();
    updateProduct.name = updateProductDto.name;
    updateProduct.price = updateProductDto.price;
    updateProduct.discount = updateProductDto.discount;
    updateProduct.color = updateProductDto.color;
    updateProduct.size = updateProductDto.size;
    updateProduct.shortDescription = updateProductDto.shortDescription;
    updateProduct.description = updateProductDto.description;
    updateProduct.productCategoryId = updateProductDto.productCategoryId;
    updateProduct.active = updateProductDto.active;
    updateProduct.launches = updateProductDto.launches;
    updateProduct.bestSeller = updateProductDto.bestSeller;
    updateProduct.imageUrl = updateProduct.imageUrl;
    updateProduct.subcategories = updateProductDto.subcategories;

    return updateProduct;
  }
}
