-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
