import StaffModel from '../models/staff'

class StaffService {
  public static async getStaffByUserId(userId: number) {
    return StaffModel.findByUserId(userId)
  }
}

export default StaffService
