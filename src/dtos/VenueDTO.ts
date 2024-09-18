import { Venue } from '@prisma/client'
import { prisma } from '..'
import { Venue as VenueResolverType } from '../../gql/resolvers-types'

type VenueDTOProps = Partial<Venue>

export default class VenueDTO {
  props: VenueDTOProps

  constructor(props: VenueDTOProps) {
    this.props = props
  }

  async create() {
    const { lat, lng, name, geohash } = this.props
    if (!lat || !lng || !name || !geohash) {
      throw Error('invalid props')
    }
    const data = await prisma.venue.create({
      data: {
        lat,
        lng,
        name,
        geohash,
      },
    })
    return new VenueDTO(data)
  }

  async connect(concertId: string) {
    if (!this.props.id) {
      throw Error('invalid id.')
    }
    const data = await prisma.concertsOnVenues.create({
      data: {
        concertId,
        venueId: this.props.id,
      },
    })
    return new VenueDTO({
      id: data.venueId,
    })
  }

  serialize(): VenueResolverType {
    return {
      __typename: 'Venue',
      geohash: this.props.geohash ?? '',
      id: this.props.id ?? '',
      lat: this.props.lat ?? 0.0,
      lng: this.props.lng ?? 0.0,
      name: this.props.name ?? '',
    }
  }
}
