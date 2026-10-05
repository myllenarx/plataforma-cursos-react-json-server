-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "perfil" "PerfilUsuario" NOT NULL DEFAULT 'ALUNO';
