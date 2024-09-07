import { User } from '@prisma/client'
import { User as UserResolverType } from 'gql/resolvers-types'
import { prisma } from '..'

export default class UserDTO {
  props: Partial<User>

  constructor(props: Partial<User>) {
    this.props = props
  }

  static async find(params: {
    id?: string
    email?: string
    accessToken?: string
  }) {
    const data = await prisma.user.findFirst({
      where: {
        id: params.id,
        email: params.email,
        auth_token: {
          every: {
            access_token: params.accessToken,
          },
        },
      },
    })
    if (!data) return null
    return new UserDTO(data)
  }

  async create() {
    if (!this.props.provider || !this.props.email) {
      throw Error('provider value or email value is invalid')
    }
    const created = await prisma.user.create({
      data: {
        email: this.props.email,
        password: this.props.password,
        passwordSalt: this.props.passwordSalt,
        provider: this.props.provider,
      },
    })

    return new UserDTO(created)
  }

  serialize(): UserResolverType {
    return {
      __typename: 'User',
      createdAt: this.props.createdAt?.toISOString(),
      email: this.props.email ?? '',
      id: this.props.id ?? '',
    }
  }
}
