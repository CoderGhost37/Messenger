import { z } from "zod"

export const AuthScehma = z.object({
	name: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(6),
})
