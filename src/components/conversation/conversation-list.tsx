"use client"

import { cn } from "@/lib/utils"
import type { User } from "@prisma/client"
import { find } from "lodash"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { ConversationBox } from "@/components/conversation/conversation-box"
import { GroupChatModal } from "@/components/conversation/group-chat-modal"
import type { FullConversationType } from "@/components/conversation/type"
import { useConversation } from "@/hooks/use-conversation"
import { pusherClient } from "@/lib/pusher"

interface ConversationListProps {
	initialItems: FullConversationType[]
	users: User[]
}

export function ConversationList({ initialItems, users }: ConversationListProps) {
	const { data: session } = useSession()
	const router = useRouter()
	const [items, setItems] = useState(initialItems)

	const { conversationId, isOpen } = useConversation()

	const pusherKey = useMemo(() => {
		return session?.user?.email
	}, [session?.user?.email])

	useEffect(() => {
		if (!pusherKey) {
			return
		}

		pusherClient.subscribe(pusherKey)

		const newHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				if (find(current, { id: conversation.id })) {
					return current
				}

				return [conversation, ...current]
			})
		}

		const updateHandler = (conversation: FullConversationType) => {
			setItems((current) =>
				current.map((currentConversation) => {
					if (currentConversation.id === conversation.id) {
						return {
							...currentConversation,
							messages: conversation.messages,
						}
					}

					return currentConversation
				})
			)
		}

		const removeHandler = (conversation: FullConversationType) => {
			setItems((current) => {
				return [...current.filter((item) => item.id !== conversation.id)]
			})

			if (conversationId === conversation.id) {
				router.push("/conversations")
			}
		}

		pusherClient.bind("conversation:new", newHandler)
		pusherClient.bind("conversation:update", updateHandler)
		pusherClient.bind("conversation:remove", removeHandler)

		return () => {
			pusherClient.unsubscribe(pusherKey)
			pusherClient.unbind("conversation:new", newHandler)
			pusherClient.unbind("conversation:update", updateHandler)
			pusherClient.unbind("conversation:remove", removeHandler)
		}
	}, [pusherKey, conversationId, router])

	return (
		<aside
			className={cn(
				"fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
				isOpen ? "hidden" : "block w-full left-0"
			)}
		>
			<div className="px-5">
				<div className="flex justify-between mb-4 pt-4">
					<div className="text-2xl font-bold text-neutral-800">Messages</div>
					<GroupChatModal users={users} />
				</div>
				{items.map((item) => (
					<ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
				))}
			</div>
		</aside>
	)
}
