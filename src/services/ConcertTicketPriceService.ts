import ConcertTicketPriceModel from '../models/concert-ticket-price'
import { ConcertTicketPrice as ConcertTicketPriceResolverType } from '../../gql/resolvers-types'

export default class ConcertTicketPriceService {
  public static async getAllByConcertTicketId(
    concertTicketId: string
  ): Promise<ConcertTicketPriceResolverType[]> {
    const concertTicketPrices =
      await ConcertTicketPriceModel.findAllByConcertTicketId(concertTicketId)
    return concertTicketPrices.map((concertTicketPrice) => ({
      __typename: 'ConcertTicketPrice',
      ...concertTicketPrice,
      id: concertTicketPrice.id,
      price: concertTicketPrice.price,
      priceCurrency: concertTicketPrice.priceCurrency,
      title: concertTicketPrice.title,
    }))
  }
}
