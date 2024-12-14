import { getConversations } from "@/actions/conversations"
import { getUsers } from "@/actions/users"
import { ConversationList } from "@/components/conversation/conversation-list"
import { Sidebar } from "@/components/sidebar/sidebar"

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const conversations = await getConversations()
	const users = await getUsers()

	return (
		<Sidebar>
			<div className="min-h-screen">
				<ConversationList users={users} initialItems={conversations} />
				{children}
			</div>
		</Sidebar>
	)
}
