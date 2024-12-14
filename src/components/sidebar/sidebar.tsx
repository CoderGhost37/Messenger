import { getUser } from "@/actions/auth"
import { DesktopSidebar } from "@/components/sidebar/desktop-sidebar"
import { MobileFooter } from "@/components/sidebar/mobile-footer"

export async function Sidebar({ children }: { children: React.ReactNode }) {
	const user = await getUser()

	return (
		<div className="h-full">
			<DesktopSidebar user={user} />
			<MobileFooter />
			<main className="lg:pl-20 h-full">{children}</main>
		</div>
	)
}
