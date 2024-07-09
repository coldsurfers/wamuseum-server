import {
  PrismaClient,
  type AuthToken as PrismaAuthToken,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

export default class AuthTokenModel {
  private prismaModel: PrismaAuthToken

  constructor(authToken: PrismaAuthToken) {
    this.prismaModel = authToken
  }

  public static async create(data: {
    access_token: string
    refresh_token: string
    user_id: number
  }) {
    const authToken = await prisma.authToken.create({
      data,
    })

    return new AuthTokenModel(authToken)
  }

  public static async delete(data: { user_id: number }) {
    const deleted = await prisma.authToken.delete({
      where: {
        user_id: data.user_id,
      },
    })
    return deleted
  }

  get accessToken() {
    return this.prismaModel.access_token
  }

  get refreshToken() {
    return this.prismaModel.refresh_token
  }
}
