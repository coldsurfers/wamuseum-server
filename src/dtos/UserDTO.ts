import { UserModel } from 'src/models/user'

export default class UserDTO {
  id?: number

  email: string

  createdAt?: Date

  password?: string

  passwordSalt?: string

  provider?: string

  constructor(params: {
    id?: number
    email: string
    createdAt?: Date
    password?: string
    passwordSalt?: string
    provider?: string
  }) {
    const { id, email, createdAt, password, passwordSalt, provider } = params
    this.id = id
    this.email = email
    this.createdAt = createdAt
    this.password = password
    this.passwordSalt = passwordSalt
    this.provider = provider
  }

  static async find(params: {
    id?: number
    email?: string
    accessToken?: string
  }) {
    const { id, email, accessToken } = params
    if (typeof id === 'number') {
      const prismaUser = await UserModel.findById(id)
      if (!prismaUser) return null
      const {
        id: userId,
        email: userEmail,
        createdAt,
        password,
        passwordSalt,
      } = prismaUser
      return new UserDTO({
        id: userId,
        email: userEmail,
        createdAt,
        password: password ?? '',
        passwordSalt: passwordSalt ?? '',
      })
    }
    if (email) {
      const prismaUser = await UserModel.findByEmail(email)
      if (!prismaUser) return null
      const {
        id: userId,
        email: userEmail,
        createdAt,
        password,
        passwordSalt,
      } = prismaUser
      return new UserDTO({
        id: userId,
        email: userEmail,
        createdAt,
        password: password ?? '',
        passwordSalt: passwordSalt ?? '',
      })
    }

    if (accessToken) {
      const prismaUser = await UserModel.findByAccessToken(accessToken)
      if (!prismaUser) return null
      const {
        id: userId,
        email: userEmail,
        createdAt,
        password,
        passwordSalt,
      } = prismaUser
      return new UserDTO({
        id: userId,
        email: userEmail,
        createdAt,
        password: password ?? '',
        passwordSalt: passwordSalt ?? '',
      })
    }
    return null
  }

  async create() {
    if (!this.provider) {
      throw Error('provider value is invalid')
    }
    const created = await UserModel.create({
      email: this.email,
      password: this.password,
      passwordSalt: this.passwordSalt,
      provider: this.provider,
    })
    const {
      id: userId,
      email: userEmail,
      createdAt,
      password,
      passwordSalt,
    } = created
    return new UserDTO({
      id: userId,
      email: userEmail,
      createdAt,
      password: password ?? '',
      passwordSalt: passwordSalt ?? '',
    })
  }
}
