import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { CursoModule } from './curso/curso.module';
import { ModuloModule } from './modulo/modulo.module';
import { AulaModule } from './aula/aula.module';
import { MatriculaModule } from './matricula/matricula.module';
import { ProgressoAulaModule } from './progresso-aula/progresso-aula.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { TrilhaModule } from './trilha/trilha.module';
import { TrilhaCursoModule } from './trilha-curso/trilha-curso.module';
import { CertificadoModule } from './certificado/certificado.module';
import { PlanoModule } from './plano/plano.module';
import { AssinaturaModule } from './assinatura/assinatura.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [
    PrismaModule,
    UsuarioModule,
    AuthModule,
    CategoriaModule,
    CursoModule,
    ModuloModule,
    AulaModule,
    MatriculaModule,
    ProgressoAulaModule,
    AvaliacaoModule,
    TrilhaModule,
    TrilhaCursoModule,
    CertificadoModule,
    PlanoModule,
    AssinaturaModule,
    PagamentoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
