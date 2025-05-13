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

import { PlantDto } from './dto/plant.dto';
import { PlantService } from './plant.service';

@Controller('plant')
export class PlantController {
    constructor(private readonly plantService: PlantService) {}

  @Post()
    create(@Body() createPlantDto: PlantDto) {
        return this.plantService.create(createPlantDto);
    }

  @Get()
  findAll(
    @Query('locationId') locationId: string,
    @Query('searchText') searchText: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
  ) {
      return this.plantService.findAll(locationId, searchText, skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.plantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantDto: PlantDto) {
      return this.plantService.update(id, updatePlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.plantService.remove(id);
  }
}
