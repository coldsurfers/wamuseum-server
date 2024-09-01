import ConcertDTO from '../dtos/ConcertDTO'
import ConcertModel from '../models/concert'
import { Concert as ConcertResolverType } from '../../gql/resolvers-types'

export default class ConcertService {
  public static async getList({
    page,
    limit,
    orderBy,
  }: {
    page: number
    limit: number
    orderBy: {
      createdAt?: 'asc' | 'desc'
    }
  }): Promise<ConcertResolverType[]> {
    const list = await ConcertModel.list({
      page,
      limit,
      orderBy,
    })
    return list.map((concert) => ({
      __typename: 'Concert',
      ...concert,
      id: concert.id,
      title: concert.title,
      concertCategory: concert.concertCategory ?? {
        __typename: 'ConcertCategory',
        createdAt: new Date(),
        id: 0,
        title: '',
      },
      createdAt: concert.createdAt.toISOString(),
    }))
  }

  public static async getConcertById(id: string): Promise<ConcertDTO | null> {
    const concert = await ConcertDTO.findById(id)
    return concert
  }

  public static async getAllCount(): Promise<number> {
    return ConcertModel.count()
  }

  public static async deleteById(id: string) {
    return ConcertModel.delete(id)
  }

  public static async create(data: {
    title: string
    date?: Date
    location?: string
    concertCategoryId?: number
    artist?: string
    tickets?: { openDate: Date; seller: string; sellingURL: string }[]
    posters?: { imageURL: string }[]
  }): Promise<ConcertResolverType> {
    const concert = await ConcertModel.create(data)
    return {
      __typename: 'Concert',
      ...concert,
      id: concert.id,
      title: concert.title,
      concertCategory: concert.concertCategory ?? {
        __typename: 'ConcertCategory',
        id: 0,
        title: '',
      },
      createdAt: concert.createdAt.toISOString(),
    }
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
  ): Promise<ConcertResolverType> {
    const concert = await ConcertModel.updateById(id, data)
    return {
      __typename: 'Concert',
      ...concert,
      id: concert.id,
      title: concert.title,
      concertCategory: concert.concertCategory ?? {
        __typename: 'ConcertCategory',
        id: 0,
        title: '',
      },
      createdAt: concert.createdAt.toISOString(),
    }
  }
}
