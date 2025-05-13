import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { Plant, PlantSchema } from './schemas/plant.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
    ],
    controllers: [PlantController],
    providers: [PlantService],
})
export class PlantModule {}
