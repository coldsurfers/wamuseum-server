import { type User as PrismaUser } from '@coldsurfers/prisma-schema'
import { prisma } from '../accounts-schema/libs/prismaClient'

export class UserModel {
  public prismaModel: PrismaUser

  constructor(user: PrismaUser) {
    this.prismaModel = user
  }

  public static async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        staff: true,
      },
    })

    return user ? new UserModel(user) : null
  }

  public static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user ? new UserModel(user) : null
  }

  public static async create(data: {
    email: string
    provider: string
    password?: string
    passwordSalt?: string
  }) {
    const user = await prisma.user.create({
      data,
    })

    return new UserModel(user)
  }

  public static async update(
    id: number,
    data: { email?: string; password?: string }
  ) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })

    return new UserModel(user)
  }
}
