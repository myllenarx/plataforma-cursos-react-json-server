import { Controller, Get, Post, Body, Patch, Param, Delete } from
  '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('users') // Agrupa os endpoints sob a tag 'users'
@Controller('users')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }
  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() creatUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(creatUsuarioDto);
  }
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() {
    return this.usuarioService.findAll();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuário' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}