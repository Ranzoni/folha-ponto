-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "lunch_period_start" DROP NOT NULL,
ALTER COLUMN "lunch_period_end" DROP NOT NULL,
ALTER COLUMN "second_period_start" DROP NOT NULL,
ALTER COLUMN "second_period_end" DROP NOT NULL;
