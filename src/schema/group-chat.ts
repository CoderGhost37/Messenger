import { z } from "zod"

export const GroupChatSchema = z.object({
	name: z.string(),
	members: z.array(
		z.object({
			value: z.string(),
			label: z.string(),
		})
	),
})
