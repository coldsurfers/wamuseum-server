import ConcertPosterModel from '../models/concert-poster'
import { ConcertPoster as ConcertPosterResolverType } from '../../gql/resolvers-types'

export default class ConcertPosterService {
  public static async create(data: {
    concertId: string
    imageURL: string
  }): Promise<ConcertPosterResolverType> {
    const created = await ConcertPosterModel.create(data)
    return {
      __typename: 'ConcertPoster',
      id: created.id,
      imageURL: created.imageURL,
    }
  }

  public static async updateImageURLById(
    id: string,
    imageURL: string
  ): Promise<ConcertPosterResolverType> {
    const updated = await ConcertPosterModel.updateImageURLById(id, imageURL)
    return {
      __typename: 'ConcertPoster',
      id: updated.id,
      imageURL: updated.imageURL,
    }
  }
}
