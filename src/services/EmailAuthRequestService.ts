import EmailAuthRequestModel from '../models/email-auth-request'
import { EmailAuthRequest as EmailAuthRequestResolverType } from '../../gql/resolvers-types'

class EmailAuthRequestService {
  public static async create(data: {
    email: string
  }): Promise<EmailAuthRequestResolverType> {
    const { createdAt, email, id, authcode } =
      await EmailAuthRequestModel.create(data)

    return {
      __typename: 'EmailAuthRequest',
      createdAt: createdAt.toISOString(),
      email,
      id,
      authcode,
    }
  }

  public static async getLatestByEmail(
    email: string
  ): Promise<EmailAuthRequestResolverType | null> {
    const emailAuthRequest = await EmailAuthRequestModel.findLatest(email)
    if (!emailAuthRequest) return null
    const { createdAt, email: lastestEmail, id, authcode } = emailAuthRequest
    return {
      __typename: 'EmailAuthRequest',
      createdAt: createdAt.toISOString(),
      email: lastestEmail,
      id,
      authcode,
    }
  }

  public static async updateAuthenticatedById(
    id: string,
    authenticated: boolean
  ): Promise<EmailAuthRequestResolverType> {
    const updated = await EmailAuthRequestModel.updateAuthenticatedById(
      id,
      authenticated
    )
    const {
      createdAt,
      email: lastestEmail,
      id: updatedId,
      authcode,
      authenticated: updatedAuthenticated,
    } = updated
    return {
      __typename: 'EmailAuthRequest',
      createdAt: createdAt.toISOString(),
      email: lastestEmail,
      id: updatedId,
      authcode,
      authenticated: updatedAuthenticated,
    }
  }
}

export default EmailAuthRequestService
