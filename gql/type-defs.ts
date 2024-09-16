const typeDefs = `#graphql
  type User {
    id: String!
    email: String!
    isAdmin: Boolean
    createdAt: String
    password: String
    passwordSalt: String
  }

  type AuthToken {
    accessToken: String!
    refreshToken: String!
  }

  type UserWithAuthToken {
    user: User!
    authToken: AuthToken!
  }

  type EmailAuthRequest {
    id: String!
    email: String!
    authenticated: Boolean
    createdAt: String!
    authcode: String!
  }

  type Artist {
    id: String!
    name: String!
  }

  type Concert {
    id: String!
    title: String!
    date: String!
    createdAt: String!
    updatedAt: String
  }

  type ConcertList {
    list: [Concert]
  }

  type Pagination {
    current: Int!
    count: Int!
  }

  type ConcertListWithPagination {
    list: ConcertList
    pagination: Pagination
  }

  type Poster {
    id: String!
    imageURL: String!
  }

  type Price {
    id: String!
    price: Float!
    title: String!
    priceCurrency: String!
  }

  type Ticket {
    id: String!
    openDate: String!
    seller: String!
    sellingURL: String!
  }

  input CreateUserInput {
    email: String!
    password: String!
    passwordConfirm: String!
  }

  input CreateEmailAuthRequestInput {
    email: String!
  }

  input AuthenticateEmailAuthRequestInput {
    email: String!
    authcode: String!
  }

  input CreateConcertConcertTicketPricesInput {
    title: String!
    price: Float!
    priceCurrency: String!
  }

  input CreateConcertConcertTicketInput {
    openDate: String!
    seller: String!
    sellingURL: String!
    ticketPrices: [CreateConcertConcertTicketPricesInput!]!
  }

  input CreateConcertInput {
    title: String!
    date: String!
  }

  input UpdateConcertInput {
    id: String!
    title: String!
    date: String!
  }

  input RemoveConcertInput {
    id: String!
  }

  input CreateConcertTicketInput {
    concertId: String!
    openDate: String!
    seller: String!
    sellingURL: String!
  }

  input UpdateConcertTicketInput {
    id: String!
    openDate: String
    seller: String
    sellingURL: String
  }

  input UpdateConcertPosterInput {
    id: String!
    imageURL: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateConcertPosterInput {
    concertId: String!
    imageURL: String!
  }

  type HttpError {
    code: Int!
    message: String!
  }

  type PosterList {
    list: [Poster]
  }

  type ArtistList {
    list: [Artist]
  }

  union AuthenticateEmailAuthRequestData = EmailAuthRequest | HttpError

  union CreateUserData = User | HttpError

  union LoginData = UserWithAuthToken | HttpError

  union ConcertListData = ConcertListWithPagination | HttpError

  union ConcertPosterData = PosterList | HttpError

  union UserData = User | HttpError

  union CreateConcertData = Concert | HttpError

  union ConcertData = Concert | HttpError

  union UpdateConcertData = Concert | HttpError

  union RemoveConcertData = Concert | HttpError

  union CreateConcertTicketData = Ticket | HttpError

  union UpdateConcertTicketData = Ticket | HttpError

  union UpdateConcertPosterData = Poster | HttpError

  union CreateConcertPosterData = Poster | HttpError

  union CreateArtistData = Artist | HttpError

  union SearchArtistsData = ArtistList | HttpError

  union ConcertArtistData = ArtistList | HttpError

  union CreateConcertArtistData = Artist | HttpError

  input ConcertListOrderBy {
    createdAt: String!
  }

  input CreateArtistInput {
    artistName: String!
  }

  input CreateConcertArtistInput {
    artistId: String!
    concertId: String!
  }

  type Query {
    me: UserData
    user(
      id: Int!
    ): UserData
    concertList(
      page: Int!
      limit: Int!
      orderBy: ConcertListOrderBy!
    ): ConcertListData
    concert(
      id: String!
    ): ConcertData
    concertArtists(
      concertId: String!
    ): ConcertArtistData
    concertPoster(
      concertId: String!
    ): ConcertPosterData
    searchArtists(
      keyword: String!
    ): SearchArtistsData
  }

  type Mutation {
    createUser(
      input: CreateUserInput!
    ): CreateUserData
    createEmailAuthRequest(
      input: CreateEmailAuthRequestInput!
    ): EmailAuthRequest
    authenticateEmailAuthRequest(
      input: AuthenticateEmailAuthRequestInput!
    ): AuthenticateEmailAuthRequestData
    login(
      input: LoginInput!
    ): LoginData
    logout: User!
    createConcert(
      input: CreateConcertInput!
    ): CreateConcertData
    updateConcert(
      input: UpdateConcertInput!
    ): UpdateConcertData
    removeConcert(
      input: RemoveConcertInput!
    ): RemoveConcertData
    createConcertTicket(
      input: CreateConcertTicketInput!
    ): CreateConcertTicketData
    updateConcertTicket(
      input: UpdateConcertTicketInput!
    ): UpdateConcertTicketData
    createConcertPoster(
      input: CreateConcertPosterInput!
    ): CreateConcertPosterData
    updateConcertPoster(
      input: UpdateConcertPosterInput!
    ): UpdateConcertPosterData
    createArtist(
      input: CreateArtistInput!
    ): CreateArtistData
    createConcertArtist(
      input: CreateConcertArtistInput!
    ): CreateConcertArtistData
  }
`

export default typeDefs
