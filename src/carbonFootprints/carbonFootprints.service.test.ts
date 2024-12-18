import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import {getTestEmissionFactor, getTestProductCarbonFootprint} from "../seed-dev-data";
import { ProductCarbonFootprint } from "./carbonFootprint.entity";
import { CarbonFootprintService } from "./carbonFootprints.service";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";

let hamPizzaCarbonFootprint = getTestProductCarbonFootprint("hamPizza");
let cheeseCarbonEmissionFactor = getTestEmissionFactor("cheese");
let flourCarbonEmissionFactor = getTestEmissionFactor("flour");
let oliveOilCarbonEmissionFactor = getTestEmissionFactor("oliveOil");
let carbonFootprintService: CarbonFootprintService;

beforeAll(async () => {
  await dataSource.initialize();
  carbonFootprintService = new CarbonFootprintService(
    dataSource.getRepository(CarbonEmissionFactor),
    dataSource.getRepository(ProductCarbonFootprint),
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(ProductCarbonFootprint)
    .save(hamPizzaCarbonFootprint);
});

describe("CarbonFootprint.service", () => {
  it("should calculate product carbon footprint, and erase existing footprint", async () => {
    await GreenlyDataSource.cleanDatabase();
    await dataSource.getRepository(CarbonEmissionFactor).save([
      cheeseCarbonEmissionFactor,
      flourCarbonEmissionFactor,
      oliveOilCarbonEmissionFactor,
    ]);

    const product = {
      name: "cheesePizza",
      ingredients: [
        { name: "cheese", quantity: 1, unit: "kg" },
        { name: "flour", quantity: 0.5, unit: "kg" },
        { name: "oliveOil", quantity: 0.1, unit: "kg" },
      ],
    };
    await carbonFootprintService.calculateProductCarbonFootprint(product);
    const result = await dataSource
      .getRepository(ProductCarbonFootprint)
      .findOne({ where: { productName: "cheesePizza" } });
    expect(result?.carbonFootprint).toBe(0.20500000000000002);

    const productModified = {
      name: "cheesePizza",
      ingredients: [
        { name: "cheese", quantity: 0.5, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    }

    await carbonFootprintService.calculateProductCarbonFootprint(productModified);
    const resultModified = await dataSource
      .getRepository(ProductCarbonFootprint)
      .findOne({ where: { productName: "cheesePizza" } });
    expect(resultModified?.carbonFootprint).toBe(0.203);
  });

  it("should calculate product carbon footprint with missing emission factor", async () => {
    const product = {
      name: "someCuriousRecipe",
      ingredients: [
        { name: "curiousIngredient", quantity: 0.3, unit: "kg" },
        { name: "suspiciousPaste", quantity: 0.5, unit: "kg" },
      ],
    }

    const result = await carbonFootprintService.calculateProductCarbonFootprint(product);
    expect(result.carbonFootprint).toBeNull();
  });

  it("should retrieve product carbon footprints", async () => {
    const productCarbonFootprints = await carbonFootprintService.findAllProducts();
    expect(productCarbonFootprints).toHaveLength(1);
    expect(productCarbonFootprints[0].productName).toBe("hamPizza");
    expect(productCarbonFootprints[0].carbonFootprint).toBe(2.15);
  });

  it("should retrieve product carbon footprint by name", async () => {
    const productCarbonFootprint = await carbonFootprintService.findProductByName("hamPizza");
    expect(productCarbonFootprint?.productName).toBe("hamPizza");
    expect(productCarbonFootprint?.carbonFootprint).toBe(2.15);

    const productCarbonFootprint2 = await carbonFootprintService.findProductByName("nonExistingProduct");
    expect(productCarbonFootprint2).toBeNull();
  });
});
