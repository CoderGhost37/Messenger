import { Sidebar } from "@/components/sidebar/sidebar"

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
	return (
		<Sidebar>
			<div className="min-h-screen">{children}</div>
		</Sidebar>
	)
}
