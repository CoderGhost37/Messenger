"use client"
import { getConversation } from "@/actions/conversations"
import type { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useCallback, useTransition } from "react"
import { UserAvatar } from "./avatar"

interface UserBoxProps {
	data: User
}

export function UserBox({ data }: UserBoxProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(() => {
		startTransition(() => {
			getConversation(data.id).then((conversation) => {
				router.push(`/conversation/${conversation.id}`)
			})
		})
	}, [data, router])

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			onClick={handleClick}
			className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
		>
			<UserAvatar image={data.image} />
			<div className="min-w-0 flex-1">
				<div className="focus:outline-none">
					<div className="flex justify-between items-center mb-1">
						<p className="text-sm font-medium text-gray-900">{data.name}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
