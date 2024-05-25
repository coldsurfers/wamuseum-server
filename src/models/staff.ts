import { type Staff as PrismaStaff } from '@coldsurfers/prisma-schema'
import { prisma } from '../accounts-schema/libs/prismaClient'

class StaffModel {
  private prismaModel: PrismaStaff

  public constructor(staff: PrismaStaff) {
    this.prismaModel = staff
  }

  public static async findById(id: string): Promise<StaffModel | null> {
    const staff = await prisma.staff.findUnique({
      where: {
        id,
      },
    })
    return staff ? new StaffModel(staff) : null
  }

  public static async findByUserId(userId: number): Promise<StaffModel | null> {
    const staff = await prisma.staff.findUnique({
      where: {
        user_id: userId,
      },
    })

    return staff ? new StaffModel(staff) : null
  }
}

export default StaffModel
