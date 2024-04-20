"use server";
import { prisma } from "../../../../../../../packages/db/providers/prisma";

export const updateUserNameViaTrpc = async (userId: string, name: string) => {
  await prisma.user.update({ where: { id: userId }, data: { name } });
};
