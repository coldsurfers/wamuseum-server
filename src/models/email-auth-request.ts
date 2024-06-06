import {
  PrismaClient,
  EmailAuthRequest as PrismaEmailAuthRequest,
} from '@coldsurfers/prisma-schema'
import { createEmailAuthCode } from '../utils/createEmailAuthcode'

const prisma = new PrismaClient()

class EmailAuthRequestModel {
  private prismaModel: PrismaEmailAuthRequest

  constructor(emailAuthRequest: PrismaEmailAuthRequest) {
    this.prismaModel = emailAuthRequest
  }

  public static async create(data: { email: string }) {
    const created = await prisma.emailAuthRequest.create({
      data: {
        email: data.email,
        authcode: createEmailAuthCode(),
      },
      select: {
        id: true,
        email: true,
        authcode: true,
        createdAt: true,
      },
    })
    return created
  }

  public static async findLatest(email: string) {
    const result = await prisma.emailAuthRequest.findFirst({
      where: {
        email,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        authcode: true,
        authenticated: true,
        createdAt: true,
        email: true,
        authenticatedAt: true,
      },
    })
    if (!result) return null
    return new EmailAuthRequestModel(result)
  }

  public static async updateAuthenticatedById(
    id: string,
    authenticated: boolean
  ) {
    const updated = await prisma.emailAuthRequest.update({
      where: {
        id,
      },
      data: {
        authenticated,
      },
      select: {
        id: true,
        authcode: true,
        authenticated: true,
        createdAt: true,
        email: true,
        authenticatedAt: true,
      },
    })
    return new EmailAuthRequestModel(updated)
  }

  get id() {
    return this.prismaModel.id
  }

  get authenticated() {
    return this.prismaModel.authenticated
  }

  get authcode() {
    return this.prismaModel.authcode
  }

  get createdAt() {
    return this.prismaModel.createdAt
  }

  get email() {
    return this.prismaModel.email
  }
}

export default EmailAuthRequestModel
