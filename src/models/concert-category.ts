import {
  PrismaClient,
  type ConcertCategory as PrismaConcertCategory,
} from '@coldsurfers/prisma-schema'

const prisma = new PrismaClient()

export default class ConcertCategoryModel {
  private prismaModel: PrismaConcertCategory

  constructor(concertCategory: PrismaConcertCategory) {
    this.prismaModel = concertCategory
  }

  public static async create(data: { title: string }) {
    const created = await prisma.concertCategory.create({
      data,
    })
    return new ConcertCategoryModel(created)
  }

  public static async findById(id: number) {
    const concertCategory = await prisma.concertCategory.findUnique({
      where: {
        id,
      },
    })
    return concertCategory ? new ConcertCategoryModel(concertCategory) : null
  }

  public static async findByConcertId(concertId: string) {
    const concertCategory = await prisma.concertCategory.findFirst({
      where: {
        concerts: {
          some: {
            id: concertId,
          },
        },
      },
    })
    return concertCategory ? new ConcertCategoryModel(concertCategory) : null
  }

  public static async findAll() {
    const list = await prisma.concertCategory.findMany({})
    return list.map((listItem) => new ConcertCategoryModel(listItem))
  }

  get id() {
    return this.prismaModel.id
  }

  get title() {
    return this.prismaModel.title
  }

  get createdAt() {
    return this.prismaModel.createdAt
  }
}
