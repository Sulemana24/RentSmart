import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      return { userId: "user", timestamp: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", { metadata, file });

      return {
        ...file,
        metadata,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
