import { getUsers } from "@/actions/users"
import { Sidebar } from "@/components/sidebar/sidebar"
import { UserList } from "@/components/user-list"

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
	const users = await getUsers()
	return (
		<Sidebar>
			<div className="min-h-screen">
				<UserList items={users} />
				{children}
			</div>
		</Sidebar>
	)
}
