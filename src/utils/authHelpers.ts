import { GraphqlContext } from 'gql/Context'
import { GraphQLError } from 'graphql'
import { User } from 'gql/resolvers-types'
import StaffModel from 'src/models/staff'
import { StaffService, UserService } from '../services'

export async function authorizeUser(
  ctx: GraphqlContext,
  options: {
    requiredRole?: 'staff'
    email?: string
  }
) {
  const { email } = options
  let user: User | null = null

  if (email) {
    user = await UserService.getUserByEmail(email)
    if (!user) {
      throw new GraphQLError('권한이 없습니다', {
        extensions: {
          code: 401,
        },
      })
    }
  } else {
    user = await UserService.getUserByAccessToken(ctx.token ?? '')
    if (!user) {
      throw new GraphQLError('권한이 없습니다', {
        extensions: {
          code: 401,
        },
      })
    }
  }

  const { id: userId } = user

  const { requiredRole } = options
  let staff: StaffModel | null = null
  if (requiredRole) {
    if (requiredRole === 'staff') {
      staff = await StaffService.getStaffByUserId(userId)
      if (!staff || !staff.isAuthorized) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
    }
  }

  return { user, staff }
}
