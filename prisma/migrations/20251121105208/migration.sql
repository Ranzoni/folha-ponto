/*
  Warnings:

  - You are about to drop the column `department_id` on the `group_members` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_department_id_fkey";

-- AlterTable
ALTER TABLE "group_members" DROP COLUMN "department_id",
ADD COLUMN     "employee_id" INTEGER;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
