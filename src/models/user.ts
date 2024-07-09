import {
  PrismaClient,
  type User as PrismaUser,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

export class UserModel {
  private prismaModel: PrismaUser

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

  public static async findByAccessToken(accessToken: string) {
    const user = await prisma.user.findFirst({
      where: {
        auth_token: {
          some: {
            access_token: accessToken,
          },
        },
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

  get id(): number {
    return this.prismaModel.id
  }

  get email(): string {
    return this.prismaModel.email
  }

  get password(): string | null {
    return this.prismaModel.password
  }

  get passwordSalt(): string | null {
    return this.prismaModel.passwordSalt
  }

  get createdAt(): Date {
    return this.prismaModel.createdAt
  }
}
