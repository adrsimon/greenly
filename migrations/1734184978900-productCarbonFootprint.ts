import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductCarbonFootprint1734184978900 implements MigrationInterface {
    name = 'ProductCarbonFootprint1734184978900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carbon_footprints" ("id" SERIAL NOT NULL, "productName" character varying NOT NULL, "carbonFootprint" double precision, CONSTRAINT "PK_a8b03661109eb3a419b3fbeb455" PRIMARY KEY ("id"), CONSTRAINT "UQ_productName" UNIQUE ("productName"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carbon_footprints"`);
    }

}
