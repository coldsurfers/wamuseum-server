import UserDTO from 'src/dtos/UserDTO'
import { UserModel } from '../models/user'
import { User as UserResolverType } from '../../gql/resolvers-types'

class UserService {
  static async getUserById(id: number): Promise<UserResolverType | null> {
    const userDTO = await UserDTO.findById(id)
    if (!userDTO) return null
    const { email, id: userId, createdAt, password, passwordSalt } = userDTO
    return {
      __typename: 'User',
      email,
      id: userId,
      createdAt: createdAt.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async getUserByEmail(email: string): Promise<UserResolverType | null> {
    const user = await UserModel.findByEmail(email)
    if (!user) return null
    const {
      email: userEmail,
      id: userId,
      createdAt,
      password,
      passwordSalt,
    } = user
    return {
      __typename: 'User',
      email: userEmail,
      id: userId,
      createdAt: createdAt.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async getUserByAccessToken(
    accessToken: string
  ): Promise<UserResolverType | null> {
    const user = await UserModel.findByAccessToken(accessToken)
    if (!user) return null
    const { email, id: userId, createdAt, password, passwordSalt } = user
    return {
      __typename: 'User',
      email,
      id: userId,
      createdAt: createdAt.toISOString(),
      password,
      passwordSalt,
    }
  }

  static async createUser(data: {
    email: string
    provider: string
    password?: string
    passwordSalt?: string
  }): Promise<UserResolverType> {
    const user = await UserModel.create(data)
    const { email, id: userId, createdAt, password, passwordSalt } = user
    return {
      __typename: 'User',
      email,
      id: userId,
      createdAt: createdAt.toISOString(),
      password,
      passwordSalt,
    }
  }
}

export default UserService
