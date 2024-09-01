import { ConcertTicket } from 'gql/resolvers-types'
import ConcertTicketModel from '../models/concert-ticket'

export default class ConcertTicketDTO {
  id: string

  openDate?: string

  seller?: string

  sellingURL?: string

  constructor({
    id,
    openDate,
    seller,
    sellingURL,
  }: {
    id: string
    openDate?: string
    seller?: string
    sellingURL?: string
  }) {
    this.id = id
    this.openDate = openDate
    this.seller = seller
    this.sellingURL = sellingURL
  }

  static async findTickets(concertId: string) {
    const list = await ConcertTicketModel.findTicketsByConcertId(concertId)
    return list.map(
      (item) =>
        new ConcertTicketDTO({
          id: item.id,
          openDate: item.openDate.toISOString(),
          seller: item.seller,
          sellingURL: item.sellingURL,
        })
    )
  }

  async update(
    id: string,
    data: {
      openDate?: Date
      seller?: string
      sellingURL?: string
    }
  ) {
    const {
      id: updatedId,
      openDate,
      seller,
      sellingURL,
    } = await ConcertTicketModel.update(id, data)
    return new ConcertTicketDTO({
      id: updatedId,
      openDate: openDate.toISOString(),
      seller,
      sellingURL,
    })
  }

  serialize(): ConcertTicket {
    return {
      __typename: 'ConcertTicket',
      id: this.id,
      openDate: this.openDate ?? '',
      seller: this.seller ?? '',
      sellingURL: this.sellingURL ?? '',
      ticketPrices: [],
    }
  }
}
