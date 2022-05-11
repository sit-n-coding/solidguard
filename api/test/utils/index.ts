import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../../src/app.module';

export const prismaClient = new PrismaClient();

export const clearDB = async () => {
  await prismaClient.exploit.deleteMany();
  await prismaClient.subscribe.deleteMany();
  await prismaClient.contract.deleteMany();
  await prismaClient.user.deleteMany();
};

export const getModuleRef = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
  }).compile();
};

export const expectAnyAsyncError = async (
  promise: Promise<any>
): Promise<void> => {
  try {
    await promise;
  } catch (e) {
    return;
  }
  throw new Error('Error is not thrown');
};

export const promiseTimer = async (delay: number) => {
  return new Promise((r) => {
    setTimeout(r, delay);
  });
};
