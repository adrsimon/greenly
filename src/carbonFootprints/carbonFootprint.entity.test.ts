import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { ProductCarbonFootprint } from "./carbonFootprint.entity";

let productCarbonFootprint: ProductCarbonFootprint;

beforeAll(async () => {
  await dataSource.initialize();
  productCarbonFootprint = new ProductCarbonFootprint({
    productName: "chickenKatsuCurry",
    carbonFootprint: 3.2,
  });
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});

describe("ProductCarbonFootprintEntity", () => {
  describe("constructor", () => {
    it("should create a product carbon footprint", () => {
      expect(productCarbonFootprint.productName).toBe("chickenKatsuCurry");
    });

    it("should throw an error if the product name is empty", () => {
      expect(() => {
        const productCarbonFootprint = new ProductCarbonFootprint({
          productName: "",
          carbonFootprint: 3.2,
        });
      }).toThrow();
    });
  });
});
