/*
  Warnings:

  - You are about to drop the column `description` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Media` table. All the data in the column will be lost.
  - Added the required column `mediaDescription` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaTitle` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaType` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaUrl` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `watchPartyId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "description",
DROP COLUMN "title",
DROP COLUMN "url",
ADD COLUMN     "mediaDescription" TEXT NOT NULL,
ADD COLUMN     "mediaTitle" TEXT NOT NULL,
ADD COLUMN     "mediaType" TEXT NOT NULL,
ADD COLUMN     "mediaUrl" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "watchPartyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_watchPartyId_fkey" FOREIGN KEY ("watchPartyId") REFERENCES "WatchParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
