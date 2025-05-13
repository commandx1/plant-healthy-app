import { IsNotEmpty } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
      name: string;

  @IsNotEmpty()
      latitude: string;

  @IsNotEmpty()
      longitude: string;

  @IsNotEmpty()
      userId: string;
}
