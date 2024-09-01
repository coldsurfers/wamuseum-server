import { EmailAuthRequest } from 'gql/resolvers-types'
import EmailAuthRequestModel from 'src/models/email-auth-request'

export default class EmailAuthRequestDTO {
  id?: string

  email?: string

  authcode?: string

  authenticated?: boolean

  createdAt?: Date

  constructor({
    id,
    email,
    authcode,
    authenticated,
    createdAt,
  }: {
    id?: string
    email?: string
    authcode?: string
    authenticated?: boolean
    createdAt?: Date
  }) {
    this.id = id
    this.email = email
    this.authcode = authcode
    this.createdAt = createdAt
    this.authenticated = authenticated
  }

  async create() {
    if (!this.email) {
      throw Error('invalid email value')
    }
    const created = await EmailAuthRequestModel.create({
      email: this.email,
    })
    return new EmailAuthRequestDTO(created)
  }

  static async findLatest(email: string) {
    const data = await EmailAuthRequestModel.findLatest(email)
    if (!data) {
      return null
    }
    const { id, authcode, authenticated, createdAt, email: dataEmail } = data
    return new EmailAuthRequestDTO({
      id,
      authcode,
      authenticated,
      createdAt,
      email: dataEmail,
    })
  }

  async update({ id, authenticated }: { id: string; authenticated: boolean }) {
    const data = await EmailAuthRequestModel.updateAuthenticatedById(
      id,
      authenticated
    )
    const {
      id: dataId,
      authcode,
      authenticated: dataAuthenticated,
      createdAt,
      email: dataEmail,
    } = data
    return new EmailAuthRequestDTO({
      id: dataId,
      authcode,
      authenticated: dataAuthenticated,
      createdAt,
      email: dataEmail,
    })
  }

  serialize(): EmailAuthRequest {
    return {
      __typename: 'EmailAuthRequest',
      authcode: this.authcode ?? '',
      authenticated: this.authenticated,
      createdAt: this.createdAt?.toISOString() ?? '',
      email: this.email ?? '',
      id: this.id ?? '',
    }
  }
}
