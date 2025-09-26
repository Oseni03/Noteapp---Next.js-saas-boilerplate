/*
  Warnings:

  - You are about to drop the column `maxNotes` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsers` on the `organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "maxNotes",
DROP COLUMN "maxUsers";

-- AlterTable
ALTER TABLE "public"."subscription" ADD COLUMN     "maxNotes" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "maxUsers" INTEGER NOT NULL DEFAULT 3;
