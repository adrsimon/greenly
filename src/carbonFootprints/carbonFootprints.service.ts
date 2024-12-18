import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { ProductCarbonFootprint } from "./carbonFootprint.entity";
import {CreateCarbonFootprintDto} from "./dto/create-carbonFootprint.dto";

@Injectable()
export class CarbonFootprintService {
  constructor(
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>,
    @InjectRepository(ProductCarbonFootprint)
    private productCarbonFootprintRepository: Repository<ProductCarbonFootprint>
  ) {}

  async calculateProductCarbonFootprint(product: CreateCarbonFootprintDto): Promise<ProductCarbonFootprint> {
    let totalCarbonFootprint = 0;

    for (const ingredient of product.ingredients) {
      const emissionFactor = await this.carbonEmissionFactorRepository.findOne({
        where: { name: ingredient.name, unit: ingredient.unit },
      });

      if (!emissionFactor) {
        return this.productCarbonFootprintRepository.save({
          productName: product.name,
          carbonFootprint: null,
        });
      }

      totalCarbonFootprint +=
        ingredient.quantity * emissionFactor.emissionCO2eInKgPerUnit;
    }

    const existingProduct = await this.productCarbonFootprintRepository.findOne({
      where: { productName: product.name }
    });

    if (existingProduct) {
      existingProduct.carbonFootprint = totalCarbonFootprint;
      return this.productCarbonFootprintRepository.save(existingProduct);
    }

    return this.productCarbonFootprintRepository.save({
      productName: product.name,
      carbonFootprint: totalCarbonFootprint,
    });
  }

  findAllProducts(): Promise<ProductCarbonFootprint[]> {
    return this.productCarbonFootprintRepository.find();
  }

  findProductByName(name: string): Promise<ProductCarbonFootprint | null> {
    return this.productCarbonFootprintRepository.findOne({
      where: { productName: name },
    });
  }
}
