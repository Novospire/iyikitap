/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `List` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ListCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ListCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ListCategory" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "List_slug_key" ON "List"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ListCategory_slug_key" ON "ListCategory"("slug");
