"use server"

import { prisma } from "@/lib/prisma"
import { getUser } from "./auth"

export async function getUsers() {
	const user = await getUser()

	if (!user?.email) {
		return []
	}

	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
			where: {
				NOT: {
					email: user.email,
				},
			},
		})

		return users
	} catch {
		return []
	}
}
