/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wxid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customer"."User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phoneVerified" TIMESTAMP(3),
ADD COLUMN     "wxid" TEXT,
ADD COLUMN     "wxidVerified" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "customer"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_wxid_key" ON "customer"."User"("wxid");
