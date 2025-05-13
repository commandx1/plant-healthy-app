import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { PlantDto } from './dto/plant.dto';
import { PlantDocument } from './schemas/plant.schema';

@Injectable()
export class PlantService {
    constructor(
    @InjectModel('Plant') private locationModel: Model<PlantDocument>,
    ) {}

    create(createPlantDto: PlantDto) {
        const userId = new Types.ObjectId(createPlantDto.userId);
        const locationId = new Types.ObjectId(createPlantDto.locationId);
        return this.locationModel.create({ ...createPlantDto, userId, locationId });
    }

    async findAll(
        locationId?: string,
        searchText?: string,
        skip: string = '',
        limit: string = '',
    ) {
        const filter: {
      locationId?: Types.ObjectId;
      $or?: any[];
    } = {};

        const skipN = +skip;
        const limitN = +limit;

        if (locationId) {
            filter.locationId = new Types.ObjectId(locationId);
        }

        if (searchText) {
            const expression = { $regex: searchText, $options: 'i' };

            filter.$or = [{ name: expression }, { type: expression }];

            if (+searchText) {
                filter.$or.push(
                    { weeklyWaterNeed: +searchText },
                    { expectedHumidity: +searchText },
                );
            }
        }

        const listQuery = this.locationModel.find(filter);

        if (skipN) {
            listQuery.skip(skipN);
        }

        if (limitN) {
            listQuery.limit(limitN);
        }

        const [list, count] = await Promise.all([
            listQuery.exec(),
            this.locationModel.countDocuments(filter),
        ]);

        return { list, count };
    }

    findOne(id: number) {
        return this.locationModel.findById(id);
    }

    update(id: string, updatePlantDto: PlantDto) {
        const userId = new Types.ObjectId(updatePlantDto.userId);
        const locationId = new Types.ObjectId(updatePlantDto.locationId);
        return this.locationModel.findByIdAndUpdate(id, {
            $set: { ...updatePlantDto, userId, locationId },
        });
    }

    remove(id: string) {
        return this.locationModel.findByIdAndDelete(id);
    }
}
