import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface AvatarProps {
	image: string | null
}

export function UserAvatar({ image }: AvatarProps) {
	const isActive = true
	return (
		<div className="relative inline-block">
			<Avatar>
				<AvatarImage src={image || "/images/placeholder.jpg"} />
			</Avatar>

			{isActive && (
				<span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
			)}
		</div>
	)
}
