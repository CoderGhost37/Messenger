"use client"
import { useState } from "react"

import { useRoutes } from "@/hooks/use-routes"

import { UserAvatar } from "@/components/avatar"
import { DesktopItem } from "@/components/sidebar/desktop-item"
import type { SessionUser } from "@/schema/user"
// import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
	user: SessionUser | null
}

export function DesktopSidebar({ user }: DesktopSidebarProps) {
	const routes = useRoutes()
	const [isOpen, setIsOpen] = useState(false)

	const isActive = true

	return (
		<>
			{/* <SettingsModal
        currentUser={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      /> */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
				<nav className="mt-4 flex flex-col justify-between">
					<ul className="flex flex-col items-center space-y-1">
						{routes.map((item) => (
							<DesktopItem
								key={item.label}
								href={item.href}
								label={item.label}
								icon={item.icon}
								active={item.active}
								onClick={item.onClick}
							/>
						))}
					</ul>
				</nav>
				<nav className="mt-4 flex flex-col justify-between items-center">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						onClick={() => setIsOpen(true)}
						className="cursor-pointer hover:opacity-75 transition"
					>
						<UserAvatar image={user?.image as string} />
					</div>
				</nav>
			</div>
		</>
	)
}
