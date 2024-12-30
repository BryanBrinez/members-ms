-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MIEMBRO');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectsId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
