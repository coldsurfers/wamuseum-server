import {
  PrismaClient,
  ConcertTicketPrice as PrismaConcertTicketPrice,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

export default class ConcertTicketPriceModel {
  private prismaModel: PrismaConcertTicketPrice

  constructor(concertCategory: PrismaConcertTicketPrice) {
    this.prismaModel = concertCategory
  }

  public static async create({
    concertTicketId,
    price,
    priceCurrency,
    title,
  }: {
    concertTicketId: string
    price: number
    priceCurrency: string
    title: string
  }) {
    const created = await prisma.concertTicketPrice.create({
      data: {
        price,
        priceCurrency,
        title,
        concertTicket: {
          connect: {
            id: concertTicketId,
          },
        },
      },
    })
    return new ConcertTicketPriceModel(created)
  }

  public static async findAllByConcertTicketId(concertTicketId: string) {
    const ticketPrices = await prisma.concertTicketPrice.findMany({
      where: {
        concertTicketId,
      },
    })

    return ticketPrices.map(
      (ticketPrice) => new ConcertTicketPriceModel(ticketPrice)
    )
  }

  get id() {
    return this.prismaModel.id
  }

  get price() {
    return this.prismaModel.price
  }

  get priceCurrency() {
    return this.prismaModel.priceCurrency
  }

  get title() {
    return this.prismaModel.title
  }
}
