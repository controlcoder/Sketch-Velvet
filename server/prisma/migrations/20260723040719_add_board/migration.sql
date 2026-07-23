/*
  Warnings:

  - Added the required column `viewport` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "viewport" JSONB NOT NULL;
