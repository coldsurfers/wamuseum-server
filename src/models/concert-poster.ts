import {
  PrismaClient,
  ConcertPoster as PrismaConcertPoster,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

class ConcertPosterModel {
  private prismaModel: PrismaConcertPoster

  constructor(concertPoster: PrismaConcertPoster) {
    this.prismaModel = concertPoster
  }

  public static async create(data: { concertId: string; imageURL: string }) {
    const created = await prisma.concertPoster.create({
      data,
      select: {
        concertId: true,
        createdAt: true,
        id: true,
        imageURL: true,
      },
    })
    return created
  }

  public static async updateImageURLById(id: string, imageURL: string) {
    const updated = await prisma.concertPoster.update({
      data: {
        imageURL,
      },
      where: {
        id,
      },
    })
    return updated
  }

  get id() {
    return this.prismaModel.id
  }

  get concertId() {
    return this.prismaModel.concertId
  }

  get imageURL() {
    return this.prismaModel.imageURL
  }
}

export default ConcertPosterModel
