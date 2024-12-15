"use client"

import type { Conversation, User } from "@prisma/client"

import { UserAvatar } from "@/components/avatar"
import { useOtherUser } from "@/hooks/use-other-user"
import Link from "next/link"
import { useMemo } from "react"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2"

interface HeaderProps {
	conversation: Conversation & {
		users: User[]
	}
}

export function Header({ conversation }: HeaderProps) {
	const otherUser = useOtherUser(conversation)

	const isActive = true

	const statusText = useMemo(() => {
		if (conversation.isGroup) {
			return `${conversation.users.length} members`
		}

		return isActive ? "Active" : "Offline"
	}, [conversation, isActive])

	return (
		<>
			<div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
				<div className="flex gap-3 items-center">
					<Link
						href="/conversations"
						className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
					>
						<HiChevronLeft size={32} />
					</Link>
					<UserAvatar image={otherUser.image} />
					<div className="flex flex-col">
						<div>{conversation.name || otherUser.name}</div>
						<div className="text-sm font-light text-neutral-500">{statusText}</div>
					</div>
				</div>
				<HiEllipsisHorizontal
					size={32}
					className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
				/>
			</div>
		</>
	)
}
