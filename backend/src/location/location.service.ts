import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { LocationDto } from './dto/location.dto';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationService {
    constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    ) {}

    create(createLocationDto: LocationDto) {
        const userId = new Types.ObjectId(createLocationDto.userId);
        return this.locationModel.create({ ...createLocationDto, userId });
    }

    findAll(userId?: string) {
        const filter: { userId?: Types.ObjectId } = {};

        if (userId) {
            filter.userId = new Types.ObjectId(userId);
        }
        return this.locationModel.find(filter);
    }

    findOne(id: number) {
        return this.locationModel.findById(id);
    }

    update(id: number, updateLocationDto: LocationDto) {
        return this.locationModel.findByIdAndUpdate(id, {
            $set: updateLocationDto,
        });
    }

    remove(id: number) {
        return this.locationModel.findByIdAndDelete(id);
    }
}
