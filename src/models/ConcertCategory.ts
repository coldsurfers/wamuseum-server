import { prisma } from '..'

export default class ConcertCategory {
  public id?: number

  public title: string

  constructor(
    params: Required<Pick<ConcertCategory, 'title'>> &
      Pick<ConcertCategory, 'id'>
  ) {
    const { id, title } = params
    this.id = id
    this.title = title
  }

  public async create() {
    const { title } = this
    const created = await prisma.adminConcertCategory.create({
      data: {
        title,
      },
    })
    return created
  }

  public static async find(id: number) {
    const concertCategory = await prisma.adminConcertCategory.findUnique({
      where: {
        id,
      },
    })
    return concertCategory
  }

  public static async listAll() {
    const list = await prisma.adminConcertCategory.findMany({})
    return list
  }
}
