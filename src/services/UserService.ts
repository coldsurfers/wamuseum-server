import UserDTO from 'src/dtos/UserDTO'
import { User as UserResolverType } from '../../gql/resolvers-types'

class UserService {
  static async getUserById(id: number): Promise<UserResolverType | null> {
    const userDTO = await UserDTO.find({ id })
    if (!userDTO) return null
    const { email, id: userId, createdAt, password, passwordSalt } = userDTO
    return {
      __typename: 'User',
      email,
      id: userId ?? 0,
      createdAt: createdAt?.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async getUserByEmail(email: string): Promise<UserResolverType | null> {
    const userDTO = await UserDTO.find({ email })
    if (!userDTO) return null
    const {
      email: userEmail,
      id: userId,
      createdAt,
      password,
      passwordSalt,
    } = userDTO
    return {
      __typename: 'User',
      email: userEmail,
      id: userId ?? 0,
      createdAt: createdAt?.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async getUserByAccessToken(
    accessToken: string
  ): Promise<UserResolverType | null> {
    const userDTO = await UserDTO.find({ accessToken })
    if (!userDTO) return null
    const { email, id: userId, createdAt, password, passwordSalt } = userDTO
    return {
      __typename: 'User',
      email,
      id: userId ?? 0,
      createdAt: createdAt?.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async createUser({
    email,
    provider,
    password,
    passwordSalt,
  }: {
    email: string
    provider: string
    password?: string
    passwordSalt?: string
  }): Promise<UserResolverType> {
    const userDTO = new UserDTO({
      email,
      provider,
      password,
      passwordSalt,
    })
    const created = await userDTO.create()
    const {
      email: createdEmail,
      id: userId,
      createdAt,
      password: createdPassword,
      passwordSalt: createdPasswordSalt,
    } = created
    return {
      __typename: 'User',
      email: createdEmail,
      id: userId ?? 0,
      createdAt: createdAt?.toISOString(),
      password: createdPassword,
      passwordSalt: createdPasswordSalt,
    }
  }
}

export default UserService
