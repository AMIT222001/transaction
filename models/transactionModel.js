import {PrismaClient} from "@prisma/client";
const prisma =new PrismaClient();
export async function createTransaction(data)
{
  return prisma.transaction.create({data});
}
export async function getTransactionsByUser(userKey)
{
  return prisma.transaction.findMany({
    where:{userKey}
  });
}