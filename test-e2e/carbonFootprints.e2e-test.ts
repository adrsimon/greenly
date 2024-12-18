import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import {dataSource, GreenlyDataSource} from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { ProductCarbonFootprint } from "../src/carbonFootprints/carbonFootprint.entity";
import { getTestProductCarbonFootprint } from "../src/seed-dev-data";
import {CreateCarbonFootprintDto} from "../src/carbonFootprints/dto/create-carbonFootprint.dto";

beforeAll(async () => {
  await dataSource.initialize();
  await GreenlyDataSource.cleanDatabase();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("CarbonFootprintsController", () => {
  let app: INestApplication;
  let defaultProductCarbonFootprints: ProductCarbonFootprint[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource
      .getRepository(ProductCarbonFootprint)
      .save([getTestProductCarbonFootprint("hamPizza"), getTestProductCarbonFootprint("beefPizza")]);

    defaultProductCarbonFootprints = await dataSource
      .getRepository(ProductCarbonFootprint)
      .find();
  });

  it("GET /carbon-footprints", async () => {
    return request(app.getHttpServer())
      .get("/carbon-footprints")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultProductCarbonFootprints);
      });
  });

  it("GET /carbon-footprints/:name", async () => {
    return request(app.getHttpServer())
      .get("/carbon-footprints/hamPizza")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(defaultProductCarbonFootprints[0]);
      });
  });

  it("POST /carbon-footprints", async () => {
    const carbonFootprintArgs: CreateCarbonFootprintDto = {
      name: "cheesePizza",
      ingredients: [
        { name: "Test Ingredient", quantity: 1, unit: "kg" },
      ],
    };

    return request(app.getHttpServer())
      .post("/carbon-footprints")
      .send(carbonFootprintArgs)
      .expect(201)
      .expect(({ body }: { body: ProductCarbonFootprint } ) => {
        expect(body.productName).toEqual(carbonFootprintArgs.name);
        expect(body.carbonFootprint).toEqual(null);
      });
  });
});
