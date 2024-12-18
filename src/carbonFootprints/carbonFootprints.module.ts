import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonFootprintController } from "./carbonFootprints.controller";
import { CarbonFootprintService } from "./carbonFootprints.service";
import { ProductCarbonFootprint } from "./carbonFootprint.entity";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCarbonFootprint, CarbonEmissionFactor]),
  ],
  controllers: [CarbonFootprintController],
  providers: [CarbonFootprintService],
})
export class CarbonFootprintsModule {}
