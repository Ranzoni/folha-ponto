/*
  Warnings:

  - Changed the type of `content` on the `log_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "log_events" DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;
