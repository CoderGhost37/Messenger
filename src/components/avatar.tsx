import type { User } from "@prisma/client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useActiveList } from "@/hooks/use-active-list"

interface AvatarProps {
	user: User | null
}

export function UserAvatar({ user }: AvatarProps) {
	const { members } = useActiveList()
	const isActive = members.indexOf(user?.email!) !== -1

	return (
		<div className="relative inline-block">
			<Avatar>
				<AvatarImage src={user?.image || "/images/placeholder.jpg"} />
			</Avatar>

			{isActive && (
				<span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
			)}
		</div>
	)
}
