import {
  type ConcertTicket as PrismaConcertTicket,
  type ConcertTicketPrice as PrismaConcertTicketPrice,
  PrismaClient,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

class ConcertTicketModel {
  private prismaModel: PrismaConcertTicket

  private _ticketPrices?: PrismaConcertTicketPrice[]

  constructor(concertTicket: PrismaConcertTicket) {
    this.prismaModel = concertTicket
  }

  public static async findTicketsByConcertId(concertId: string) {
    const tickets = await prisma.concertTicket.findMany({
      where: {
        concertId,
      },
    })

    return tickets.map((ticket) => new ConcertTicketModel(ticket))
  }

  public static async update(
    id: string,
    data: {
      openDate?: Date
      seller?: string
      sellingURL?: string
    }
  ) {
    const updatedTicket = await prisma.concertTicket.update({
      where: {
        id,
      },
      data,
    })

    return new ConcertTicketModel(updatedTicket)
  }

  get id() {
    return this.prismaModel.id
  }

  get openDate() {
    return this.prismaModel.openDate
  }

  get seller() {
    return this.prismaModel.seller
  }

  get sellingURL() {
    return this.prismaModel.sellingURL
  }

  get ticketPrices() {
    // eslint-disable-next-line no-underscore-dangle
    return this._ticketPrices
  }
}

export default ConcertTicketModel
