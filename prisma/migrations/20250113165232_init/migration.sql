-- CreateEnum
CREATE TYPE "DebtCategory" AS ENUM ('Monthly', 'Daily', 'Weekly', 'EveryXDays', 'OneTime');

-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('Completed', 'InProgress');

-- CreateEnum
CREATE TYPE "HistoryType" AS ENUM ('increase', 'payment');

-- CreateTable
CREATE TABLE "Debtor" (
    "id" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "thaiName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtSection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DebtCategory" NOT NULL,
    "status" "DebtStatus" NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebtSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtMember" (
    "id" TEXT NOT NULL,
    "debtorId" TEXT NOT NULL,
    "debtSectionId" TEXT NOT NULL,
    "outstandingCash" DOUBLE PRECISION NOT NULL,
    "increaseDebt" DOUBLE PRECISION,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebtMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "debtMemberId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "HistoryType" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Debtor_englishName_key" ON "Debtor"("englishName");

-- CreateIndex
CREATE UNIQUE INDEX "DebtMember_debtorId_debtSectionId_key" ON "DebtMember"("debtorId", "debtSectionId");

-- AddForeignKey
ALTER TABLE "DebtMember" ADD CONSTRAINT "DebtMember_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtMember" ADD CONSTRAINT "DebtMember_debtSectionId_fkey" FOREIGN KEY ("debtSectionId") REFERENCES "DebtSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_debtMemberId_fkey" FOREIGN KEY ("debtMemberId") REFERENCES "DebtMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
