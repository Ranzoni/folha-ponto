/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "permissions_employee_id_key" ON "permissions"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_group_id_key" ON "permissions"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_department_id_key" ON "permissions"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_role_id_key" ON "permissions"("role_id");
