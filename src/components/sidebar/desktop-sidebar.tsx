"use client"
import type { User } from "@prisma/client"
import { useState } from "react"

import { useRoutes } from "@/hooks/use-routes"

import { UserAvatar } from "@/components/avatar"
import { Modal } from "@/components/modal"
import { DesktopItem } from "@/components/sidebar/desktop-item"
import { SettingsDrawer } from "@/components/sidebar/settings-drawer"
import type { SessionUser } from "@/schema/user"

interface DesktopSidebarProps {
	user: SessionUser | null
}

export function DesktopSidebar({ user }: DesktopSidebarProps) {
	const routes = useRoutes()
	const [isOpen, setIsOpen] = useState(false)

	return (
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
				<Modal
					open={isOpen}
					toggle={() => setIsOpen((prev) => !prev)}
					title="Profile"
					description="Update your profile information"
					trigger={
						<div className="cursor-pointer hover:opacity-75 transition">
							<UserAvatar user={user as User} />
						</div>
					}
					body={<SettingsDrawer user={user} toggle={() => setIsOpen((prev) => !prev)} />}
				/>
			</nav>
		</div>
	)
}
