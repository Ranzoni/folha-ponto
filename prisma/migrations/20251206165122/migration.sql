/*
  Warnings:

  - Changed the type of `entity` on the `permission_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `permission_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "permission_items" DROP COLUMN "entity",
ADD COLUMN     "entity" SMALLINT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" SMALLINT NOT NULL;

-- DropEnum
DROP TYPE "PermissionEntity";

-- DropEnum
DROP TYPE "PermissionType";
