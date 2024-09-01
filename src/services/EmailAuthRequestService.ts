import EmailAuthRequestDTO from '../dtos/EmailAuthRequestDTO'

class EmailAuthRequestService {
  public static async create(data: {
    email: string
  }): Promise<EmailAuthRequestDTO> {
    const emailAuthDTO = new EmailAuthRequestDTO(data)
    const created = await emailAuthDTO.create()
    return created
  }

  public static async getLatestByEmail(
    email: string
  ): Promise<EmailAuthRequestDTO | null> {
    const emailAuthDTO = await EmailAuthRequestDTO.findLatest(email)
    return emailAuthDTO
  }

  public static async updateAuthenticatedById(
    id: string,
    authenticated: boolean
  ): Promise<EmailAuthRequestDTO> {
    const emailAuthDTO = new EmailAuthRequestDTO({
      id,
      authenticated,
    })
    const updated = await emailAuthDTO.update({
      id,
      authenticated,
    })
    return updated
  }
}

export default EmailAuthRequestService
