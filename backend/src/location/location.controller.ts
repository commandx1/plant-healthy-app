import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';

import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

  @Post()
    create(@Body() createLocationDto: LocationDto) {
        return this.locationService.create(createLocationDto);
    }

  @Get()
  findAll(@Query('userId') userId: string) {
      return this.locationService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.locationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: LocationDto) {
      return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.locationService.remove(+id);
  }
}
