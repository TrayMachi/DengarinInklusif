/*
  Warnings:

  - Added the required column `description` to the `MaterialContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaterialContent" ADD COLUMN     "description" TEXT NOT NULL;
