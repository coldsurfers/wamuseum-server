import ConcertCategoryModel from '../models/concert-category'
import { ConcertCategory as ConcertCategoryResolverType } from '../../gql/resolvers-types'

export default class ConcertCategoryService {
  public static async getConcertCategoryById(
    id: number
  ): Promise<ConcertCategoryResolverType | null> {
    const concertCategory = await ConcertCategoryModel.findById(id)
    if (!concertCategory) return null
    return {
      __typename: 'ConcertCategory',
      id: concertCategory.id,
      title: concertCategory.title,
    }
  }

  public static async getAllConcertCategories(): Promise<
    ConcertCategoryResolverType[]
  > {
    const concertCategories = await ConcertCategoryModel.findAll()
    return concertCategories.map((concertCategory) => ({
      __typename: 'ConcertCategory',
      id: concertCategory.id,
      title: concertCategory.title,
    }))
  }

  public static async getConcertCategoryByConcertId(
    concertId: string
  ): Promise<ConcertCategoryResolverType | null> {
    const concertCategory =
      await ConcertCategoryModel.findByConcertId(concertId)
    if (!concertCategory) return null
    return {
      __typename: 'ConcertCategory',
      id: concertCategory.id,
      title: concertCategory.title,
    }
  }

  public static async create(data: {
    title: string
  }): Promise<ConcertCategoryResolverType> {
    const created = await ConcertCategoryModel.create(data)

    return {
      __typename: 'ConcertCategory',
      id: created.id,
      title: created.title,
    }
  }
}
