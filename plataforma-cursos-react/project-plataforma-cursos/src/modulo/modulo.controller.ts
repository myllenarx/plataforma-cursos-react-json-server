import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ModuloService } from './modulo.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

type RequestAutenticada = {
  user: UsuarioAutenticado;
};

@ApiTags('modulos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('modulos')
export class ModuloController {
  constructor(private readonly moduloService: ModuloService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar um novo módulo' })
  create(
    @Body() createModuloDto: CreateModuloDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.moduloService.create(createModuloDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os módulos' })
  findAll() {
    return this.moduloService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um módulo pelo ID' })
  findOne(@Param('id') id: string) {
    return this.moduloService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um módulo' })
  update(
    @Param('id') id: string,
    @Body() updateModuloDto: UpdateModuloDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.moduloService.update(+id, updateModuloDto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um módulo' })
  remove(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.moduloService.remove(+id, req.user);
  }
}