import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrilhaService } from './trilha.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Controller('trilha')
export class TrilhaController {
  constructor(private readonly trilhaService: TrilhaService) {}

  @Post()
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhaService.create(createTrilhaDto);
  }

  @Get()
  findAll() {
    return this.trilhaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trilhaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhaService.update(+id, updateTrilhaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trilhaService.remove(+id);
  }
}
