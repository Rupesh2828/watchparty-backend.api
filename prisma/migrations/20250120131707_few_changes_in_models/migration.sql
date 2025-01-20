/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `watchPartyId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "watchPartyId" INTEGER NOT NULL,
ALTER COLUMN "content" SET DEFAULT 'The watch party has started! Join now.';

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_watchPartyId_fkey" FOREIGN KEY ("watchPartyId") REFERENCES "WatchParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
