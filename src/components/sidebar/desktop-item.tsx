"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface DesktopItemProps {
	label: string
	icon: any
	href: string
	onClick?: () => void
	active?: boolean
}

export function DesktopItem({ label, icon: Icon, href, onClick, active }: DesktopItemProps) {
	function handleClick() {
		if (onClick) {
			return onClick()
		}
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<li onClick={handleClick}>
			<Link
				href={href}
				className={cn(
					"group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
					active && "bg-gray-100 text-black"
				)}
			>
				<Icon className="h-6 w-6 shrink-0" />
				<span className="sr-only">{label}</span>
			</Link>
		</li>
	)
}
