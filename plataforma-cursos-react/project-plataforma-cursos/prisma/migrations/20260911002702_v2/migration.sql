/*
  Warnings:

  - You are about to drop the column `NomeCompleto` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `SenhaHash` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `name` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "NomeCompleto",
DROP COLUMN "SenhaHash",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
