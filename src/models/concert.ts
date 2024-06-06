import {
  type Concert as PrismaConcert,
  type ConcertTicket as PrismaConcertTicket,
  type ConcertTicketPrice as PrismaConcertTicketPrice,
  type ConcertCategory as PrismaConcertCategory,
} from '@coldsurfers/prisma-schema'
import { prisma } from '..'

class ConcertModel {
  private prismaModel: PrismaConcert

  private _tickets?: (PrismaConcertTicket & {
    ticketPrices?: PrismaConcertTicketPrice[]
  })[]

  private _concertCategory?: PrismaConcertCategory

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

  public static async list({
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

  public static async create(data: {
    title: string
    date?: Date
    location?: string
    concertCategoryId?: number
    artist?: string
    tickets?: { openDate: Date; seller: string; sellingURL: string }[]
    posters?: { imageURL: string }[]
  }) {
    const created = await prisma.concert.create({
      data: {
        date: data.date,
        location: data.location,
        posters: {
          createMany: {
            data: data.posters ?? [],
          },
        },
        title: data.title,
        concertCategoryId: data.concertCategoryId,
        artist: data.artist,
        tickets: {
          createMany: {
            data: data.tickets ?? [],
          },
        },
      },
      include: {
        tickets: {
          include: {
            ticketPrices: true,
          },
        },
        posters: true,
        concertCategory: true,
      },
    })

    return new ConcertModel(created)
  }

  public static async updateById(
    id: string,
    data: {
      title: string
      date?: Date
      location?: string
      concertCategoryId?: number
      artist?: string
      tickets?: { openDate: Date; seller: string; sellingURL: string }[]
      posters?: { imageURL: string }[]
    }
  ) {
    const updated = await prisma.concert.update({
      where: {
        id,
      },
      data: {
        ...data,
        tickets: {
          updateMany: {
            where: {
              concertId: id,
            },
            data: data.tickets ?? [],
          },
        },
        posters: {
          updateMany: {
            data: data.posters ?? [],
            where: {
              concertId: id,
            },
          },
        },
      },
    })

    return new ConcertModel(updated)
  }

  get createdAt() {
    return this.prismaModel.createdAt
  }

  get updatedAt() {
    return this.prismaModel.updatedAt
  }

  get date() {
    return this.prismaModel.date
  }

  get id() {
    return this.prismaModel.id
  }

  get title() {
    return this.prismaModel.title
  }

  get tickets() {
    // eslint-disable-next-line no-underscore-dangle
    return this._tickets
  }

  get concertCategory() {
    // eslint-disable-next-line no-underscore-dangle
    return this._concertCategory
  }
}

export default ConcertModel
