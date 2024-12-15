"use server"

import { prisma } from "@/lib/prisma"
import { getUser } from "./auth"

export async function getConversation(
	userId: string,
	isGroup?: boolean,
	members?: { value: string }[],
	name?: string
) {
	const user = await getUser()

	if (!user) {
		throw new Error("User not found")
	}

	if (isGroup && (!members || !name || members.length < 2)) {
		throw new Error("Invalid group conversation")
	}

	if (isGroup && members && name) {
		const newConversation = await prisma.conversation.create({
			data: {
				name,
				isGroup,
				users: {
					connect: [
						...members.map((member: { value: string }) => ({ id: member.value })),
						{ id: user.id },
					],
				},
			},
			include: {
				users: true,
			},
		})

		return newConversation
	}

	const existingConversations = await prisma.conversation.findMany({
		where: {
			OR: [
				{
					userIds: {
						equals: [userId, user.id],
					},
				},
				{
					userIds: {
						equals: [user.id, userId],
					},
				},
			],
		},
	})

	const singleConversation = existingConversations[0]

	if (singleConversation) {
		return singleConversation
	}

	const newConversation = await prisma.conversation.create({
		data: {
			isGroup: false,
			users: {
				connect: [{ id: userId }, { id: user.id }],
			},
		},
		include: {
			users: true,
		},
	})

	return newConversation
}

export async function getConversations() {
	const user = await getUser()

	if (!user || !user?.id) {
		return []
	}

	try {
		const conversations = await prisma.conversation.findMany({
			orderBy: {
				lastMessageAt: "desc",
			},
			where: {
				userIds: {
					has: user.id,
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		})

		return conversations
	} catch {
		return []
	}
}

export async function getConversationById(conversationId: string) {
	try {
		const user = await getUser()

		if (!user || !user?.email) {
			return null
		}

		const conversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		})

		return conversation
	} catch {
		return null
	}
}

export async function getMessages(conversationId: string) {
	try {
		const messages = await prisma.message.findMany({
			where: {
				conversationId: conversationId,
			},
			include: {
				sender: true,
				seen: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		})

		return messages
	} catch {
		return []
	}
}

export async function sendMessage(conversationId: string, message?: string, image?: string) {
	const user = await getUser()

	if (!user) {
		return null
	}

	try {
		const newMessage = await prisma.message.create({
			data: {
				body: message,
				image: image,
				conversation: {
					connect: {
						id: conversationId,
					},
				},
				sender: {
					connect: {
						id: user.id,
					},
				},
				seen: {
					connect: {
						id: user.id,
					},
				},
			},
			include: {
				seen: true,
				sender: true,
			},
		})

		const updatedConversation = await prisma.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						seen: true,
					},
				},
			},
		})

		return newMessage
	} catch (error: any) {
		return null
	}
}
