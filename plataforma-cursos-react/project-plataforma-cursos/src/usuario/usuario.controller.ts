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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Cadastro público de aluno',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
  })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuarioService.create(
      createUsuarioDto,
    );
  }

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Cadastrar usuário pela administração',
  })
  createByAdmin(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    return this.usuarioService.createByAdmin(
      createUsuarioDto,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os usuários',
  })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar um usuário pelo ID',
  })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar um usuário',
  })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(
      +id,
      updateUsuarioDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover um usuário',
  })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}