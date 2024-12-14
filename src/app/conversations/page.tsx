"use client"

import { useConversation } from "@/hooks/use-conversation"
import { cn } from "@/lib/utils"

export default function ConversationsPage() {
	const { isOpen } = useConversation()

	return (
		<div className={cn("lg:pl-80 min-h-screen lg:block", isOpen ? "block" : "hidden")}>
			<div className="px-4 py-10 sm:px-6 lg:px-8 min-h-screen flex justify-center items-center bg-gray-100">
				<div className="text-center items-center flex flex-col">
					<h3 className="mt-2 text-2xl font-semibold text-gray-900">
						Select a chat or start a new conversation
					</h3>
				</div>
			</div>
		</div>
	)
}
