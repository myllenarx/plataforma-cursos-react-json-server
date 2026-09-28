/*
  Warnings:

  - You are about to drop the column `DataCadastro` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Usuario_Email_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "DataCadastro",
DROP COLUMN "Email",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
