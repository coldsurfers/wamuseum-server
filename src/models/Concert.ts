import { type Concert as PrismaConcert } from '@coldsurfers/prisma-schema'
import { prisma } from '..'

class ConcertModel {
  public prismaModel: PrismaConcert

  constructor(concert: PrismaConcert) {
    this.prismaModel = concert
  }

  public static async findById(id: string) {
    const concert = await prisma.concert.findUnique({
      where: {
        id,
      },
      include: {
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        concertCategory: true,
      },
    })
    return concert ? new ConcertModel(concert) : null
  }

  public static async paginate({
    page,
    limit,
    orderBy,
  }: {
    page: number
    limit: number
    orderBy: {
      createdAt?: 'asc' | 'desc'
    }
  }) {
    const list = await prisma.concert.findMany({
      include: {
        posters: true,
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        concertCategory: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    })
    return list.map((listItem) => new ConcertModel(listItem))
  }

  public static async count() {
    const count = await prisma.concert.count()
    return count
  }

  public static async delete(id: string) {
    const deleted = await prisma.concert.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })
    return deleted
  }
}

export default ConcertModel
