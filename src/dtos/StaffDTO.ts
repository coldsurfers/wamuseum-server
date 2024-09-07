import { Staff } from '@prisma/client'
import { prisma } from '..'

export default class StaffDTO {
  props: Partial<Staff>

  constructor(props: Partial<Staff>) {
    this.props = props
  }

  static async find({ userId }: { userId: string }) {
    const data = await prisma.staff.findFirst({
      where: {
        users: {
          every: {
            userId,
          },
        },
      },
      include: {
        users: true,
      },
    })
    if (!data) return null
    return new StaffDTO(data)
  }
}
