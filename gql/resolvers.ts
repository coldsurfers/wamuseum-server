import { isAfter, addMinutes } from 'date-fns'
import { GraphQLError } from 'graphql'
import concertResolvers from '../src/resolvers/concertResolvers'
import authResolvers from '../src/resolvers/authResolvers'
import {
  ConcertPosterService,
  EmailAuthRequestService,
  ConcertTicketService,
  ConcertCategoryService,
  UserService,
  StaffService,
  ConcertService,
} from '../src/services'
import { Resolvers } from './resolvers-types'
import { sendEmail } from '../src/utils/mailer'
import userResolvers from '../src/resolvers/userResolvers'

const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...concertResolvers.Query,
    concertCategory: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }

      const concertCategory =
        await ConcertCategoryService.getConcertCategoryById(args.id)
      if (!concertCategory) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '해당하는 콘서트 카테고리가 없습니다.',
        }
      }
      return concertCategory
    },
    concertCategoryList: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const list = await ConcertCategoryService.getAllConcertCategories()
      return {
        list,
        __typename: 'ConcertCategoryList',
      }
    },
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
    createEmailAuthRequest: async (parent, args) => {
      const { email } = args.input
      const createdEmailAuthRequest = await EmailAuthRequestService.create({
        email,
      })
      await sendEmail({
        to: createdEmailAuthRequest.email,
        subject: 'Wamuseum 이메일 인증 번호',
        html: `Wamuseum의 이메일 인증 번호는 ${createdEmailAuthRequest.authcode}입니다. 3분내에 입력 해 주세요.`,
        smtpOptions: {
          service: process.env.MAILER_SERVICE,
          auth: {
            user: process.env.MAILER_EMAIL_ADDRESS,
            pass: process.env.MAILER_EMAIL_APP_PASSWORD,
          },
        },
      })
      return createdEmailAuthRequest
    },
    authenticateEmailAuthRequest: async (parent, args) => {
      const { email, authcode } = args.input
      const latest = await EmailAuthRequestService.getLatestByEmail(email)
      if (!latest) {
        return {
          __typename: 'HttpError',
          code: 404,
          message: '이메일 인증 요청을 다시 시도해주세요.',
        }
      }
      if (latest.authenticated) {
        return {
          __typename: 'HttpError',
          code: 409,
          message: '이미 인증 되었습니다.',
        }
      }
      if (
        isAfter(
          new Date(latest.createdAt),
          addMinutes(new Date(latest.createdAt), 3)
        )
      ) {
        return {
          __typename: 'HttpError',
          code: 410,
          message: '인증 시간이 만료되었습니다.',
        }
      }

      if (authcode === latest.authcode) {
        const result = await EmailAuthRequestService.updateAuthenticatedById(
          latest.id,
          true
        )
        return result
      }

      return {
        __typename: 'HttpError',
        code: 401,
        message: '유효하지 않은 인증번호 입니다.',
      }
    },
    createConcertCategory: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }

      const { title } = args.input
      const concertCategory = await ConcertCategoryService.create({ title })
      return concertCategory
    },
    createConcert: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const {
        concertCategoryId,
        artist,
        date,
        title,
        tickets,
        posterURLs,
        location,
      } = args.input
      const concert = await ConcertService.create({
        concertCategoryId,
        artist,
        location,
        date: new Date(date),
        title,
        tickets: tickets.map((ticket) => ({
          ...ticket,
          openDate: new Date(ticket.openDate),
        })),
        posters: posterURLs.map((url) => ({
          imageURL: url,
        })),
      })

      return concert
    },
    updateConcert: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const {
        id,
        artist,
        date,
        title,
        posterURLs,
        tickets,
        concertCategoryId,
        location,
      } = args.input
      const updated = await ConcertService.updateById(id, {
        artist,
        date: new Date(date),
        title,
        location,
        posters: posterURLs
          ? posterURLs.map((url) => ({
              imageURL: url,
            }))
          : undefined,
        tickets: tickets
          ? tickets.map((ticket) => ({
              ...ticket,
              openDate: new Date(ticket.openDate),
            }))
          : undefined,
        concertCategoryId,
      })

      return updated
    },
    removeConcert: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const existing = await ConcertService.getConcertById(args.input.id)
      if (!existing)
        return {
          __typename: 'HttpError',
          code: 404,
          message: '콘서트가 존재하지 않습니다.',
        }
      const removed = await ConcertService.deleteById(args.input.id)
      return {
        id: removed.id,
        __typename: 'RemovedConcert',
      }
    },
    updateConcertTicket: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id, openDate, seller, sellingURL } = args.input
      const updated = await ConcertTicketService.updateById(id, {
        openDate: openDate ? new Date(openDate) : undefined,
        seller: seller ?? undefined,
        sellingURL: sellingURL ?? undefined,
      })
      return updated
    },
    createConcertPoster: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { concertId, imageURL } = args.input
      const poster = await ConcertPosterService.create({
        concertId,
        imageURL,
      })
      if (!poster) {
        return {
          __typename: 'HttpError',
          code: 500,
          message: 'Internal Server Error',
        }
      }
      return poster
    },
    updateConcertPoster: async (parent, args, ctx) => {
      const user = await UserService.getUserByAccessToken(ctx.token ?? '')
      if (!user) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id: userId } = user
      const staff = await StaffService.getStaffByUserId(userId)
      if (!staff) {
        throw new GraphQLError('권한이 없습니다', {
          extensions: {
            code: 401,
          },
        })
      }
      const { id, imageURL } = args.input
      if (!imageURL) {
        throw new GraphQLError('invalid image url', {
          extensions: {
            code: 400,
          },
        })
      }
      const updated = await ConcertPosterService.updateImageURLById(
        id,
        imageURL
      )
      return updated
    },
  },
}

export default resolvers
