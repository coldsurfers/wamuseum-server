import { UserModel } from 'src/models/user'

export default class UserDTO {
  id: number

  email: string

  createdAt: Date

  password: string

  passwordSalt: string

  constructor(params: {
    id: number
    email: string
    createdAt: Date
    password: string
    passwordSalt: string
  }) {
    const { id, email, createdAt, password, passwordSalt } = params
    this.id = id
    this.email = email
    this.createdAt = createdAt
    this.password = password
    this.passwordSalt = passwordSalt
  }

  static async findById(id: number) {
    const prismaUser = await UserModel.findById(id)
    if (!prismaUser) return null
    const { id: userId, email, createdAt, password, passwordSalt } = prismaUser
    return new UserDTO({
      id: userId,
      email,
      createdAt,
      password: password ?? '',
      passwordSalt: passwordSalt ?? '',
    })
  }
}
