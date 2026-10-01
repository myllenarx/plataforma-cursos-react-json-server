import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PlanoService } from './plano.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@ApiTags('planos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('planos')
export class PlanoController {
  constructor(private readonly planoService: PlanoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo plano' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planoService.create(createPlanoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os planos' })
  findAll() {
    return this.planoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um plano pelo ID' })
  findOne(@Param('id') id: string) {
    return this.planoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um plano' })
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planoService.update(+id, updatePlanoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um plano' })
  remove(@Param('id') id: string) {
    return this.planoService.remove(+id);
  }
}
