-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "width" DROP DEFAULT,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "height" DROP DEFAULT;