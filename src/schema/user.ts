import { z } from "zod"

export const SessionUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().nullable(),
})

export type SessionUser = z.infer<typeof SessionUserSchema>
