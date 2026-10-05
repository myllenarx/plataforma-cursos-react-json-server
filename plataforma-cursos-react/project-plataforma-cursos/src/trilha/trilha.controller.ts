import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TrilhaService } from './trilha.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('trilhas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trilha')
export class TrilhaController {
  constructor(private readonly trilhaService: TrilhaService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova trilha' })
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhaService.create(createTrilhaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as trilhas' })
  findAll() {
    return this.trilhaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma trilha pelo ID' })
  findOne(@Param('id') id: string) {
    return this.trilhaService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrilhaDto) {
    return this.trilhaService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trilhaService.remove(+id);
  }
}