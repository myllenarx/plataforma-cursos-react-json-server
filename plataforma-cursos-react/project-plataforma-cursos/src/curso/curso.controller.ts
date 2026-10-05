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

import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

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

@ApiTags('cursos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  // PROFESSOR cria curso para si mesmo.
  // ADMIN pode informar o instrutor no DTO.
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar um novo curso' })
  create(
    @Body() createCursoDto: CreateCursoDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.cursoService.create(createCursoDto, req.user);
  }

  // Qualquer usuário autenticado pode consultar cursos
  @Get()
  @ApiOperation({ summary: 'Listar todos os cursos' })
  findAll() {
    return this.cursoService.findAll();
  }

  // Qualquer usuário autenticado pode consultar um curso
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um curso pelo ID' })
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(+id);
  }

  // PROFESSOR pode alterar somente curso próprio.
  // ADMIN pode alterar qualquer curso.
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um curso' })
  update(
    @Param('id') id: string,
    @Body() updateCursoDto: UpdateCursoDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.cursoService.update(+id, updateCursoDto, req.user);
  }

  // PROFESSOR pode excluir somente curso próprio.
  // ADMIN pode excluir qualquer curso.
  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.PROFESSOR, PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um curso' })
  remove(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.cursoService.remove(+id, req.user);
  }
}