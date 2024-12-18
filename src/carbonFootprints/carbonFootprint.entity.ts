import {Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity} from 'typeorm';

@Entity("carbon_footprints")
@Unique(['productName'])
export class ProductCarbonFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productName: string;

  @Column({ nullable: true, type: 'float' })
  carbonFootprint: number | null;

  sanitize() {
    if (this.productName === "") {
      throw new Error("Product name cannot be empty");
    }
  }

  constructor(props: {
    productName: string;
    carbonFootprint: number | null;
  }) {
    super();

    this.productName = props?.productName;
    this.carbonFootprint = props?.carbonFootprint;
    this.sanitize();
  }
}
