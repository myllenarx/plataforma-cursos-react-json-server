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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type RequestAutenticada = {
  user: {
    usuarioId: number;
    email: string;
    perfil: PerfilUsuario;
  };
};

@ApiTags('avaliacoes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(
    private readonly avaliacaoService: AvaliacaoService,
  ) { }

  @UseGuards(RolesGuard)
  @Roles(
    PerfilUsuario.ALUNO,
    PerfilUsuario.ADMIN,
  )
  @Post()
  @ApiOperation({
    summary: 'Criar uma avaliação',
  })
  create(
    @Body() dto: CreateAvaliacaoDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.avaliacaoService.create(
      dto,
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(
    PerfilUsuario.ALUNO,
    PerfilUsuario.PROFESSOR,
    PerfilUsuario.ADMIN,
  )
  @Get()
  @ApiOperation({
    summary:
      'Listar avaliações permitidas ao usuário',
  })
  findAll(@Req() req: RequestAutenticada) {
    return this.avaliacaoService.findAll(
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(
    PerfilUsuario.ALUNO,
    PerfilUsuario.PROFESSOR,
    PerfilUsuario.ADMIN,
  )
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.avaliacaoService.findOne(
      +id,
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(
    PerfilUsuario.ALUNO,
    PerfilUsuario.ADMIN,
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAvaliacaoDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.avaliacaoService.update(
      +id,
      dto,
      req.user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(
    PerfilUsuario.ALUNO,
    PerfilUsuario.ADMIN,
  )
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.avaliacaoService.remove(
      +id,
      req.user,
    );
  }
}