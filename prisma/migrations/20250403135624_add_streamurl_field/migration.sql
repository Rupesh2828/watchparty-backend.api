-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "mediaLibraryId" INTEGER;

-- AlterTable
ALTER TABLE "WatchParty" ADD COLUMN     "streamUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_mediaLibraryId_fkey" FOREIGN KEY ("mediaLibraryId") REFERENCES "MediaLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
