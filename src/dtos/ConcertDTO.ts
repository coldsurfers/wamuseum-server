import { ConcertCategory, ConcertPoster, ConcertTicket } from '@prisma/client'
import { Concert } from 'gql/resolvers-types'
import { prisma } from '..'

export default class ConcertDTO {
  id: string

  artist?: string

  title: string

  location?: string

  date?: Date

  html?: string

  concertCategory: ConcertCategory

  posters: ConcertPoster[]

  tickets: ConcertTicket[]

  createdAt?: Date

  updatedAt?: Date

  constructor(data: {
    id: string

    artist?: string

    title: string

    location?: string

    date?: Date

    html?: string

    concertCategory: ConcertCategory

    posters: ConcertPoster[]

    tickets: ConcertTicket[]

    createdAt?: Date

    updatedAt?: Date
  }) {
    this.id = data.id
    this.artist = data.artist
    this.title = data.title
    this.location = data.location
    this.date = data.date
    this.html = data.html
    this.concertCategory = data.concertCategory
    this.posters = data.posters
    this.tickets = data.tickets
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  static async findById(id: string) {
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
    if (!concert) return null
    return new ConcertDTO({
      ...concert,
      artist: concert.artist ?? undefined,
      location: concert.location ?? undefined,
      date: concert.date ?? undefined,
      html: concert.html ?? undefined,
      updatedAt: concert.updatedAt ?? undefined,
    })
  }

  serialize(): Concert {
    return {
      __typename: 'Concert',
      id: this.id,
      title: this.title,
      concertCategory: this.concertCategory ?? {
        __typename: 'ConcertCategory',
        id: 0,
        title: '',
      },
      createdAt: this.createdAt?.toISOString() ?? '',
    }
  }
}
