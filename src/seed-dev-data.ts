import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { ProductCarbonFootprint } from "./carbonFootprints/carbonFootprint.entity";

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 14,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const TEST_PRODUCT_CARBON_FOOTPRINTS = [
  {
    productName: "hamPizza",
    carbonFootprint: 2.15,
  },
  {
    productName: "cheesePizza",
    carbonFootprint: 1.17,
  },
  {
    productName: "plainPizza",
    carbonFootprint: 1.03,
  },
  {
    productName: "beefPizza",
    carbonFootprint: 14,
  },
].map((args) => {
  return new ProductCarbonFootprint({
    productName: args.productName,
    carbonFootprint: args.carbonFootprint,
  });
});

export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

export const getTestProductCarbonFootprint = (productName: string) => {
  const productCarbonFootprint = TEST_PRODUCT_CARBON_FOOTPRINTS.find(
    (item) => item.productName === productName
  );
  if (!productCarbonFootprint) {
    throw new Error(
      `test product carbon footprint with name ${productName} could not be found`
    );
  }
  return productCarbonFootprint;
}

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const carbonEmissionFactorsService =
    dataSource.getRepository(CarbonEmissionFactor);

  await carbonEmissionFactorsService.save(TEST_CARBON_EMISSION_FACTORS);
};


export const seedTestProductCarbonFootprints = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const productCarbonFootprintsService =
    dataSource.getRepository(ProductCarbonFootprint);

  await productCarbonFootprintsService.save(TEST_PRODUCT_CARBON_FOOTPRINTS);
}

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
  seedTestProductCarbonFootprints().catch((e) => console.error(e));
}
