import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  propertyImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Uploaded:", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
