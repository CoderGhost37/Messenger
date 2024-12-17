import { getConversationById, getMessages } from "@/actions/conversations"

import { Body } from "@/components/chat/body"
import { Header } from "@/components/chat/header"
import { MessageInput } from "@/components/chat/message-input"

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
	const { conversationId } = await params
	const conversation = await getConversationById(conversationId)
	const messages = await getMessages(conversationId)

	if (!conversation) {
		return (
			<div className="lg:pl-80 h-full">
				<div className="h-full flex flex-col">
					<div className="px-4 py-10 sm:px-6 lg:px-8 min-h-screen flex justify-center items-center bg-gray-100">
						<div className="text-center items-center flex flex-col">
							<h3 className="mt-2 text-2xl font-semibold text-gray-900">
								Select a chat or start a new conversation
							</h3>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="lg:pl-80 min-h-screen">
			<div className="h-screen flex flex-col">
				<Header conversation={conversation} />
				<Body initialMessages={messages} />
				<MessageInput />
			</div>
		</div>
	)
}
