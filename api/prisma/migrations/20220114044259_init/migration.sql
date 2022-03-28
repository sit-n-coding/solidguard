-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exploit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "targetAuthor" TEXT NOT NULL,
    "targetRepo" TEXT NOT NULL,
    "targetPath" TEXT NOT NULL,
    "targetRef" TEXT NOT NULL,
    "verify" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exploit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "addr" TEXT NOT NULL,
    "pause" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("addr")
);

-- CreateTable
CREATE TABLE "Subscribe" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailAddr" TEXT NOT NULL,
    "contractAddr" TEXT NOT NULL,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("emailAddr","contractAddr")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Exploit_name_key" ON "Exploit"("name");

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_contractAddr_fkey" FOREIGN KEY ("contractAddr") REFERENCES "Contract"("addr") ON DELETE RESTRICT ON UPDATE CASCADE;
