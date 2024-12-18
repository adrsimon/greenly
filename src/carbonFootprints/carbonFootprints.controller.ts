import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CarbonFootprintService } from "./carbonFootprints.service";
import {CreateCarbonFootprintDto} from "./dto/create-carbonFootprint.dto";

@Controller("carbon-footprints")
export class CarbonFootprintController {
  constructor(private readonly carbonFootprintService: CarbonFootprintService) {}

  @Post()
  async calculateAndSaveCarbonFootprint(
    @Body() product: CreateCarbonFootprintDto
  ) {
    return this.carbonFootprintService.calculateProductCarbonFootprint(product);
  }

  @Get()
  async getAllProductFootprints() {
    return this.carbonFootprintService.findAllProducts();
  }

  @Get(":productName")
  async getProductFootprint(@Param("productName") productName: string) {
    return this.carbonFootprintService.findProductByName(productName);
  }
}
