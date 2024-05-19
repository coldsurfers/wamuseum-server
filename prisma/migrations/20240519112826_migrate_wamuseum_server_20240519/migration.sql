-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "promoterId" INTEGER,
    "venueId" INTEGER,
    "artistId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "passwordSalt" TEXT,
    "provider" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promoter" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promoter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAuthRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "authcode" TEXT NOT NULL,
    "authenticated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authenticatedAt" TIMESTAMP(3),

    CONSTRAINT "EmailAuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "password" VARCHAR(255),
    "passwordSalt" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuthToken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminStaff" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_authorized" BOOLEAN NOT NULL DEFAULT false,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "AdminStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccountProfile" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAccountProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConcertCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminConcertCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConcert" (
    "id" TEXT NOT NULL,
    "artist" TEXT,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "date" TIMESTAMP(3),
    "html" TEXT,
    "concertCategoryId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "AdminConcert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConcertPoster" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminConcertPoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConcertTicket" (
    "id" TEXT NOT NULL,
    "concertId" TEXT NOT NULL,
    "openDate" TIMESTAMP(3) NOT NULL,
    "seller" TEXT NOT NULL,
    "sellingURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminConcertTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminConcertTicketPrice" (
    "id" TEXT NOT NULL,
    "concertTicketId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminConcertTicketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailAuthRequest_email_key" ON "EmailAuthRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_username_key" ON "AdminAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_email_key" ON "AdminAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAuthToken_account_id_key" ON "AdminAuthToken"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminStaff_account_id_key" ON "AdminStaff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccountProfile_account_id_key" ON "AdminAccountProfile"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccountProfile_username_key" ON "AdminAccountProfile"("username");

-- CreateIndex
CREATE INDEX "AdminConcert_concertCategoryId_idx" ON "AdminConcert"("concertCategoryId");

-- CreateIndex
CREATE INDEX "AdminConcertPoster_concertId_idx" ON "AdminConcertPoster"("concertId");

-- CreateIndex
CREATE INDEX "AdminConcertTicket_concertId_idx" ON "AdminConcertTicket"("concertId");

-- CreateIndex
CREATE INDEX "AdminConcertTicketPrice_concertTicketId_idx" ON "AdminConcertTicketPrice"("concertTicketId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_promoterId_fkey" FOREIGN KEY ("promoterId") REFERENCES "Promoter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuthToken" ADD CONSTRAINT "AdminAuthToken_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "AdminAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminStaff" ADD CONSTRAINT "AdminStaff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "AdminAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAccountProfile" ADD CONSTRAINT "AdminAccountProfile_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "AdminAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminConcert" ADD CONSTRAINT "AdminConcert_concertCategoryId_fkey" FOREIGN KEY ("concertCategoryId") REFERENCES "AdminConcertCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminConcertPoster" ADD CONSTRAINT "AdminConcertPoster_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "AdminConcert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminConcertTicket" ADD CONSTRAINT "AdminConcertTicket_concertId_fkey" FOREIGN KEY ("concertId") REFERENCES "AdminConcert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminConcertTicketPrice" ADD CONSTRAINT "AdminConcertTicketPrice_concertTicketId_fkey" FOREIGN KEY ("concertTicketId") REFERENCES "AdminConcertTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
