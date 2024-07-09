import AuthTokenModel from '../models/auth-token'
import { AuthToken as AuthTokenResolverType } from '../../gql/resolvers-types'

export default class AuthTokenService {
  public static async create(data: {
    access_token: string
    refresh_token: string
    user_id: number
  }): Promise<AuthTokenResolverType> {
    const authToken = await AuthTokenModel.create(data)
    return {
      __typename: 'AuthToken',
      accessToken: authToken.accessToken,
      refreshToken: authToken.refreshToken,
    }
  }
}
