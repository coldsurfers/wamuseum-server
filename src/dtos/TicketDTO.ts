import { Ticket } from '@prisma/client'
import { Ticket as TicketResolverType } from 'gql/resolvers-types'
import { prisma } from '..'

export default class TicketDTO {
  props: Partial<Ticket>

  constructor(props: Partial<Ticket>) {
    this.props = props
  }

  static async findTickets(concertId: string) {
    const data = await prisma.ticket.findMany({
      where: {
        concerts: {
          every: {
            concertId,
          },
        },
      },
    })
    return data.map((item) => new TicketDTO(item))
  }

  async create({ concertId }: { concertId: string }) {
    if (!this.props.openDate || !this.props.seller || !this.props.sellingURL) {
      throw Error('invalid openDate, seller, sellingURL')
    }
    const ticket = await prisma.ticket.create({
      data: {
        openDate: this.props.openDate,
        seller: this.props.seller,
        sellingURL: this.props.sellingURL,
      },
    })
    await prisma.concertsOnTickets.create({
      data: {
        concertId,
        ticketId: ticket.id,
      },
    })

    return new TicketDTO(ticket)
  }

  async update(data: {
    openDate?: Date
    seller?: string
    sellingURL?: string
  }) {
    const updated = await prisma.ticket.update({
      where: {
        id: this.props.id,
      },
      data,
    })
    return new TicketDTO(updated)
  }

  serialize(): TicketResolverType {
    return {
      __typename: 'Ticket',
      id: this.props.id ?? '',
      openDate: this.props.openDate?.toISOString() ?? '',
      seller: this.props.seller ?? '',
      sellingURL: this.props.sellingURL ?? '',
    }
  }
}
