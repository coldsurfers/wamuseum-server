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

  // public static async create({
  //   concertId
  // }: {
  //   concertId: string
  // }) {
  //   const { openDate, seller, sellingURL } = this
  //   const created = await prisma.concertTicket.create({
  //     data: {
  //       openDate,
  //       seller,
  //       sellingURL,
  //       concert: {
  //         connect: {
  //           id: concertId,
  //         },
  //       },
  //       ticketPrices: ticketPrices
  //         ? {
  //             createMany: {
  //               data: ticketPrices,
  //             },
  //           }
  //         : undefined,
  //     },
  //     include: {
  //       ticketPrices: true,
  //     },
  //   })
  //   return created
  // }

  // public static async update(
  //   id: string,
  //   params: Partial<
  //     Pick<ConcertTicket, 'openDate' | 'seller' | 'sellingURL' | 'ticketPrices'>
  //   >
  // ) {
  //   const { ticketPrices } = params
  //   const updated = await prisma.adminConcertTicket.update({
  //     data: {
  //       openDate: params.openDate,
  //       seller: params.seller,
  //       sellingURL: params.sellingURL,
  //       ticketPrices: ticketPrices
  //         ? {
  //             deleteMany: {
  //               concertTicketId: id,
  //             },
  //             createMany: {
  //               data: ticketPrices,
  //             },
  //           }
  //         : undefined,
  //     },
  //     where: {
  //       id,
  //     },
  //     include: {
  //       ticketPrices: true,
  //     },
  //   })
  //   return updated
  // }

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
