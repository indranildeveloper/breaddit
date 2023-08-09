import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
