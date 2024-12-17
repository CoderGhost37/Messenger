import { type FileRouter, createUploadthing } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { getUser } from "@/actions/auth"

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			const user = await getUser()

			if (!user) {
				throw new UploadThingError("Unauthorized")
			}

			return { userId: user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { uploadedBy: metadata.userId, url: file.url }
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
