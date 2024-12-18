"use client"

import type { Conversation, User } from "@prisma/client"
import Link from "next/link"
import { useMemo, useState } from "react"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2"

import { UserAvatar } from "@/components/avatar"
import { AvatarGroup } from "@/components/avatar-group"
import { ProfileDrawer } from "@/components/chat/profile-drawer"
import { useActiveList } from "@/hooks/use-active-list"
import { useOtherUser } from "@/hooks/use-other-user"

interface HeaderProps {
	conversation: Conversation & {
		users: User[]
	}
}

export function Header({ conversation }: HeaderProps) {
	const otherUser = useOtherUser(conversation)
	const { members } = useActiveList()
	const [drawerOpen, setDrawerOpen] = useState(false)

	const isActive = members.indexOf(otherUser.email!) !== -1

	const statusText = useMemo(() => {
		if (conversation.isGroup) {
			return `${conversation.users.length} members`
		}

		return isActive ? "Active" : "Offline"
	}, [conversation, isActive])

	return (
		<div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
			<div className="flex gap-3 items-center">
				<Link
					href="/conversations"
					className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
				>
					<HiChevronLeft size={32} />
				</Link>
				{conversation.isGroup ? (
					<AvatarGroup users={conversation.users} />
				) : (
					<UserAvatar user={otherUser} />
				)}
				<div className="flex flex-col">
					<div>{conversation.name || otherUser.name}</div>
					<div className="text-sm font-light text-neutral-500">{statusText}</div>
				</div>
			</div>
			<ProfileDrawer
				data={conversation}
				isOpen={drawerOpen}
				toggle={() => setDrawerOpen((prev) => !prev)}
				trigger={
					<HiEllipsisHorizontal
						size={32}
						className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
					/>
				}
			/>
		</div>
	)
}
