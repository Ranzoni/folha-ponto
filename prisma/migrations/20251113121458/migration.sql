/*
  Warnings:

  - You are about to drop the `rules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "rules";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "first_period_start" SMALLINT NOT NULL,
    "first_period_end" SMALLINT NOT NULL,
    "lunch_period_start" SMALLINT NOT NULL,
    "lunch_period_end" SMALLINT NOT NULL,
    "second_period_start" SMALLINT NOT NULL,
    "second_period_end" SMALLINT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
