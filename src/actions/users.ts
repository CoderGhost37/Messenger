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

export async function updateUser(name: string, image: string) {
	const user = await getUser()
	if (!user || !user?.id) {
		return { success: false }
	}

	try {
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				name,
				image,
			},
		})

		return { success: true }
	} catch {
		return { success: false }
	}
}
