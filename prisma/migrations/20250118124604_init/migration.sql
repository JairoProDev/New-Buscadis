/*
  Warnings:

  - You are about to drop the column `adisoId` on the `Favorito` table. All the data in the column will be lost.
  - You are about to drop the `Adiso` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,adisoId]` on the table `Favorito` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adisoId` to the `Favorito` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Condicion" AS ENUM ('NUEVO', 'COMO_NUEVO', 'BUEN_ESTADO', 'USADO', 'PARA_PIEZAS');

-- DropForeignKey
ALTER TABLE "Adiso" DROP CONSTRAINT "Adiso_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Adiso" DROP CONSTRAINT "Adiso_userId_fkey";

-- DropForeignKey
ALTER TABLE "Favorito" DROP CONSTRAINT "Favorito_adisoId_fkey";

-- DropIndex
DROP INDEX "Favorito_userId_adisoId_key";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Favorito" DROP COLUMN "adisoId",
ADD COLUMN     "adisoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Adiso";

-- CreateTable
CREATE TABLE "Adiso" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "imagenes" TEXT[],
    "ubicacion" TEXT NOT NULL,
    "condicion" "Condicion" NOT NULL DEFAULT 'NUEVO',
    "envio" BOOLEAN NOT NULL DEFAULT false,
    "precioNegociable" BOOLEAN NOT NULL DEFAULT false,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "Adiso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_userId_adisoId_key" ON "Favorito"("userId", "adisoId");

-- AddForeignKey
ALTER TABLE "Adiso" ADD CONSTRAINT "Adiso_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adiso" ADD CONSTRAINT "Adiso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_adisoId_fkey" FOREIGN KEY ("adisoId") REFERENCES "Adiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
