-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exploit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAddr" TEXT NOT NULL,
    "targetNames" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exploit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "addr" TEXT NOT NULL,
    "pauseable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("addr")
);

-- CreateTable
CREATE TABLE "Subscribe" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailAddr" TEXT NOT NULL,
    "contractAddr" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("emailAddr","contractAddr")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exploit_name_key" ON "Exploit"("name");

-- AddForeignKey
ALTER TABLE "Exploit" ADD CONSTRAINT "Exploit_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_contractAddr_fkey" FOREIGN KEY ("contractAddr") REFERENCES "Contract"("addr") ON DELETE RESTRICT ON UPDATE CASCADE;
