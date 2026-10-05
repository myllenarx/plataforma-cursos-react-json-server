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

import { AssinaturaService } from './assinatura.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

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

@ApiTags('assinaturas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('assinaturas')
export class AssinaturaController {
  constructor(private readonly assinaturaService: AssinaturaService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar uma nova assinatura' })
  create(
    @Body() createAssinaturaDto: CreateAssinaturaDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.assinaturaService.create(createAssinaturaDto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar assinaturas permitidas ao usuário' })
  findAll(@Req() req: RequestAutenticada) {
    return this.assinaturaService.findAll(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma assinatura pelo ID' })
  findOne(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.assinaturaService.findOne(+id, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma assinatura' })
  update(
    @Param('id') id: string,
    @Body() updateAssinaturaDto: UpdateAssinaturaDto,
  ) {
    return this.assinaturaService.update(+id, updateAssinaturaDto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma assinatura' })
  remove(@Param('id') id: string) {
    return this.assinaturaService.remove(+id);
  }
}