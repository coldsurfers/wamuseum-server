import StaffDTO from 'src/dtos/StaffDTO'

class StaffService {
  public static async getStaffByUserId(userId: number) {
    const staffDTO = await StaffDTO.find({ userId })
    return staffDTO
  }
}

export default StaffService
