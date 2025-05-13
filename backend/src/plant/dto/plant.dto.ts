import { IsNotEmpty } from 'class-validator';

export class PlantDto {
  @IsNotEmpty()
      name: string;

  @IsNotEmpty()
      type: string;

  @IsNotEmpty()
      weeklyWaterNeed: number;

  @IsNotEmpty()
      expectedHumidity: number;

  @IsNotEmpty()
      userId: string;

  @IsNotEmpty()
      locationId: string;
}
