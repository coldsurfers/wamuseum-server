import { Poster } from '@prisma/client'
import { Poster as PosterResolver } from 'gql/resolvers-types'
import { prisma } from '..'

type PosterDTOProps = Partial<Poster>

export default class PosterDTO {
  props: PosterDTOProps

  constructor(props: PosterDTOProps) {
    this.props = props
  }

  async create({ concertId }: { concertId: string }) {
    if (!this.props.imageURL) {
      throw Error('image url is invalid')
    }
    const poster = await prisma.poster.create({
      data: {
        imageURL: this.props.imageURL,
      },
    })
    const created = await prisma.concertsOnPosters.create({
      data: {
        concertId,
        posterId: poster.id,
      },
    })
    return new PosterDTO(created)
  }

  async update(data: { imageURL: string }) {
    const updated = await prisma.poster.update({
      where: {
        id: this.props.id,
      },
      data,
    })
    return new PosterDTO(updated)
  }

  serialize(): PosterResolver {
    return {
      __typename: 'Poster',
      id: this.props.id ?? '',
      imageURL: this.props.imageURL ?? '',
    }
  }
}
