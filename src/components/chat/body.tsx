"use client"

import type { FullMessageType } from "@/components/conversation/type"
import { useEffect, useRef, useState } from "react"

import { seenMessage } from "@/actions/conversations"
import { MessageBox } from "@/components/chat/message-box"
import { useConversation } from "@/hooks/use-conversation"

interface BodyProps {
	initialMessages: FullMessageType[]
}

export function Body({ initialMessages }: BodyProps) {
	const [messages, setMessages] = useState(initialMessages)
	const bottomRef = useRef<HTMLDivElement>(null)

	const { conversationId } = useConversation()

	useEffect(() => {
		async function setMessageSeen() {
			await seenMessage(conversationId)
		}

		setMessageSeen()
	}, [conversationId])

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
			))}
			<div ref={bottomRef} className="pt-24" />
		</div>
	)
}
