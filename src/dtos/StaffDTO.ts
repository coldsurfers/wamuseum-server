import StaffModel from 'src/models/staff'

export default class StaffDTO {
  id?: number

  userId?: number

  isAuthorized?: boolean

  constructor({
    id,
    isAuthorized,
    userId,
  }: {
    id?: number
    isAuthorized?: boolean
    userId?: number
  }) {
    this.id = id
    this.isAuthorized = isAuthorized
    this.userId = userId
  }

  static async find({ userId }: { userId: number }) {
    const data = await StaffModel.findByUserId(userId)
    return new StaffDTO({
      id: data?.id,
      userId: data?.userId,
      isAuthorized: data?.isAuthorized,
    })
  }
}
