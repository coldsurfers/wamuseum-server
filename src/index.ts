/* eslint-disable import/prefer-default-export */
import { PrismaClient } from '@coldsurfers/prisma-schema'

export const prisma = new PrismaClient()

export async function connect() {
  await prisma.$connect()
}

export async function disconnect() {
  await prisma.$disconnect()
}
