"use client"

import type { Conversation, User } from "@prisma/client"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { IoTrash } from "react-icons/io5"
import { toast } from "sonner"

import { deleteConversation } from "@/actions/conversations"
import { UserAvatar } from "@/components/avatar"
import { Modal } from "@/components/modal"
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useConversation } from "@/hooks/use-conversation"
import { useOtherUser } from "@/hooks/use-other-user"

interface ProfileDrawerProps {
	isOpen: boolean
	toggle: () => void
	data: Conversation & {
		users: User[]
	}
	trigger: React.ReactNode
}

export function ProfileDrawer({ isOpen, toggle, data, trigger }: ProfileDrawerProps) {
	const router = useRouter()
	const { conversationId } = useConversation()
	const otherUser = useOtherUser(data)
	const [isPending, startTransition] = useTransition()
	const [confirmOpen, setConfirmOpen] = useState(false)

	const isActive = true

	const joinedDate = useMemo(() => {
		return format(new Date(otherUser.createdAt), "PP")
	}, [otherUser.createdAt])

	const title = useMemo(() => {
		return data.name || otherUser.name
	}, [data.name, otherUser.name])

	const statusText = useMemo(() => {
		if (data.isGroup) {
			return `${data.users.length} members`
		}

		return isActive ? "Active" : "Offline"
	}, [data, isActive])

	function onDelete() {
		startTransition(() => {
			deleteConversation(conversationId)
				.then((res) => {
					if (res.success) {
						toast.success("Conversation deleted")
						router.push("/conversations")
					} else {
						toast.error("Failed to delete conversation")
					}
				})
				.finally(() => setConfirmOpen(false))
		})
	}

	return (
		<Modal
			open={isOpen}
			toggle={toggle}
			trigger={trigger}
			body={
				<div className="relative w-96">
					<div className="flex flex-col items-center">
						<div className="mb-2">
							<UserAvatar image={otherUser.image} />
						</div>
						<div>{title}</div>
						<div className="text-sm text-gray-500">{statusText}</div>
						<div className="flex gap-10 my-8">
							<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
								<AlertDialogTrigger asChild>
									<div className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
										<div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
											<IoTrash size={20} />
										</div>
										<div className="text-sm font-light text-neutral-600">Delete</div>
									</div>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this conversation? This action cannot be
											undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<Button variant="destructive" loading={isPending} onClick={onDelete}>
											Delete
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
						<div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
							<dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
								{data.isGroup && (
									<div>
										<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
											Emails
										</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
											{data.users.map((user) => user.email).join(", ")}
										</dd>
									</div>
								)}
								{!data.isGroup && (
									<div>
										<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
											Email
										</dt>
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{otherUser.email}</dd>
									</div>
								)}
								{!data.isGroup && (
									<>
										<hr />
										<div>
											<dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
												Joined
											</dt>
											<dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
												<time dateTime={joinedDate}>{joinedDate}</time>
											</dd>
										</div>
									</>
								)}
							</dl>
						</div>
					</div>
				</div>
			}
		/>
	)
}
