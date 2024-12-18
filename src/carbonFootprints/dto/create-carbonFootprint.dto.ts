export class CreateCarbonFootprintDto {
  name: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}
