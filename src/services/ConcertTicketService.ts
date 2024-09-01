import ConcertTicketDTO from '../dtos/ConcertTicketDTO'

export default class ConcertTicketService {
  public static async getListByConcertId(
    concertId: string
  ): Promise<ConcertTicketDTO[]> {
    const list = await ConcertTicketDTO.findTickets(concertId)
    return list
  }

  public static async updateById(
    id: string,
    data: {
      openDate?: Date
      seller?: string
      sellingURL?: string
    }
  ): Promise<ConcertTicketDTO> {
    const concertTicketDTO = new ConcertTicketDTO({
      id,
    })
    const updated = await concertTicketDTO.update(id, data)

    return updated
  }
}
