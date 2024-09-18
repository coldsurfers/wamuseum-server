import { Venue } from '@prisma/client'

type VenueDTOProps = Partial<Venue>

export default class VenueDTO {
  props: VenueDTOProps

  constructor(props: VenueDTOProps) {
    this.props = props
  }
}
