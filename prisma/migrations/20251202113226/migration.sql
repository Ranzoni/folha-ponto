-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "employee_id" INTEGER;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
