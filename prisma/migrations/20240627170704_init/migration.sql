-- CreateTable
CREATE TABLE "LeaderBoard" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderBoard_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "playerAId" TEXT NOT NULL,
    "playerBId" TEXT NOT NULL,
    "winner" TEXT,
    "playerAChoice" INTEGER,
    "playerBChoice" INTEGER,
    "gamePoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerAId_fkey" FOREIGN KEY ("playerAId") REFERENCES "LeaderBoard"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerBId_fkey" FOREIGN KEY ("playerBId") REFERENCES "LeaderBoard"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
