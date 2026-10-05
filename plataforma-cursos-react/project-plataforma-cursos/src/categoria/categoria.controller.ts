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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('categorias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) { }

  // Somente ADMIN pode cadastrar categorias
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  // Qualquer usuário autenticado pode consultar as categorias
  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  findAll() {
    return this.categoriaService.findAll();
  }

  // Qualquer usuário autenticado pode consultar uma categoria
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma categoria pelo ID' })
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(+id);
  }

  // Somente ADMIN pode alterar categorias
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma categoria' })
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(+id, updateCategoriaDto);
  }

  // Somente ADMIN pode excluir categorias
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma categoria' })
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id);
  }
}