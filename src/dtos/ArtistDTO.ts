import { Artist } from '@prisma/client'
import { prisma } from '..'
import { Artist as ArtistResolverType } from '../../gql/resolvers-types'

type ArtistDTOProps = Partial<Artist> & {
  profileImageURL?: string
}

export default class ArtistDTO {
  props: ArtistDTOProps

  constructor(props: ArtistDTOProps) {
    this.props = props
  }

  static async searchByKeyword(keyword: string) {
    if (keyword.split(' ').join('') === '') {
      return []
    }
    const data = await prisma.artist.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
    })
    return data.map((value) => new ArtistDTO(value))
  }

  static async findListByConcertId(concertId: string) {
    const data = await prisma.artist.findMany({
      where: {
        concerts: {
          some: {
            concertId,
          },
        },
      },
    })
    return data.map((value) => new ArtistDTO(value))
  }

  async create() {
    if (!this.props.name) {
      throw Error('invalid name')
    }
    const artist = await prisma.artist.create({
      data: {
        name: this.props.name,
        ...(this.props.profileImageURL && {
          artistProfileImage: {
            create: {
              imageURL: this.props.profileImageURL,
            },
          },
        }),
      },
    })
    return new ArtistDTO(artist)
  }

  async connect(concertId: string) {
    if (!this.props.id) {
      throw Error('invalid id')
    }
    const data = await prisma.concertsOnArtists.create({
      data: {
        artistId: this.props.id,
        concertId,
      },
    })
    const artist = await prisma.artist.findUnique({
      where: {
        id: data.artistId,
      },
    })
    return new ArtistDTO({
      id: data.artistId,
      name: artist?.name,
    })
  }

  serialize(): ArtistResolverType {
    return {
      __typename: 'Artist',
      id: this.props.id ?? '',
      name: this.props.name ?? '',
    }
  }
}
