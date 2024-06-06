import ConcertTicketModel from '../models/concert-ticket'
import { ConcertTicket as ConcertTicketResolverType } from '../../gql/resolvers-types'

export default class ConcertTicketService {
  public static async getListByConcertId(
    concertId: string
  ): Promise<ConcertTicketResolverType[]> {
    const list = await ConcertTicketModel.findTicketsByConcertId(concertId)
    return list.map(({ id, openDate, seller, sellingURL, ticketPrices }) => ({
      __typename: 'ConcertTicket',
      id,
      openDate: openDate.toISOString(),
      seller,
      sellingURL,
      ticketPrices: ticketPrices ?? [],
    }))
  }

  public static async updateById(
    id: string,
    data: {
      openDate?: Date
      seller?: string
      sellingURL?: string
    }
  ): Promise<ConcertTicketResolverType> {
    const {
      id: updatedId,
      openDate,
      seller,
      sellingURL,
      ticketPrices,
    } = await ConcertTicketModel.update(id, data)

    return {
      __typename: 'ConcertTicket',
      id: updatedId,
      openDate: openDate.toISOString(),
      seller,
      sellingURL,
      ticketPrices: ticketPrices ?? [],
    }
  }
}
