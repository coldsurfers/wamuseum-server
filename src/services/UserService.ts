import UserDTO from '../dtos/UserDTO'

class UserService {
  static async getUserById(id: number): Promise<UserDTO | null> {
    const userDTO = await UserDTO.find({ id })
    return userDTO
  }

  static async getUserByEmail(email: string): Promise<UserDTO | null> {
    const userDTO = await UserDTO.find({ email })
    return userDTO
  }

  static async getUserByAccessToken(
    accessToken: string
  ): Promise<UserDTO | null> {
    const userDTO = await UserDTO.find({ accessToken })
    return userDTO
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
  }): Promise<UserDTO> {
    const userDTO = new UserDTO({
      email,
      provider,
      password,
      passwordSalt,
    })
    const created = await userDTO.create()
    return created
  }
}

export default UserService
