"use client"
import { cn } from "@/lib/utils"
import type { User } from "@prisma/client"
import { useState } from "react"
import { MdOutlineGroupAdd } from "react-icons/md"

import { ConversationBox } from "@/components/conversation/conversation-box"
import type { FullConversationType } from "@/components/conversation/type"
import { useConversation } from "@/hooks/use-conversation"

interface ConversationListProps {
	initialItems: FullConversationType[]
	users: User[]
}

export function ConversationList({ initialItems, users }: ConversationListProps) {
	const [items, setItems] = useState(initialItems)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const { conversationId, isOpen } = useConversation()

	return (
		<>
			<aside
				className={cn(
					"fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
					isOpen ? "hidden" : "block w-full left-0"
				)}
			>
				<div className="px-5">
					<div className="flex justify-between mb-4 pt-4">
						<div className="text-2xl font-bold text-neutral-800">Messages</div>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							onClick={() => setIsModalOpen(true)}
							className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
						>
							<MdOutlineGroupAdd size={20} />
						</div>
					</div>
					{items.map((item) => (
						<ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
					))}
				</div>
			</aside>
		</>
	)
}
