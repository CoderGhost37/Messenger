"use client"

import type { FullMessageType } from "@/components/conversation/type"
import { find } from "lodash"
import { useEffect, useRef, useState } from "react"

import { seenMessage } from "@/actions/conversations"
import { MessageBox } from "@/components/chat/message-box"
import { useConversation } from "@/hooks/use-conversation"
import { pusherClient } from "@/lib/pusher"

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

	useEffect(() => {
		pusherClient.subscribe(conversationId)
		bottomRef?.current?.scrollIntoView()

		const messageHandler = async (message: FullMessageType) => {
			await seenMessage(conversationId)

			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current
				}

				return [...current, message]
			})

			bottomRef?.current?.scrollIntoView()
		}

		const updateMessageHandler = (newMessage: FullMessageType) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage
					}

					return currentMessage
				})
			)
		}

		pusherClient.bind("messages:new", messageHandler)
		pusherClient.bind("message:update", updateMessageHandler)

		return () => {
			pusherClient.unsubscribe(conversationId)
			pusherClient.unbind("messages:new", messageHandler)
			pusherClient.unbind("message:update", updateMessageHandler)
		}
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
