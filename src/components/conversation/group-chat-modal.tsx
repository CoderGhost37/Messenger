"use client"

import { GroupChatSchema } from "@/schema/group-chat"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { MdOutlineGroupAdd } from "react-icons/md"
import type { z } from "zod"

import { getConversation } from "@/actions/conversations"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { MultiSelect } from "../ui/multi-select"

interface GroupChatModalProps {
	users: User[]
}

export function GroupChatModal({ users }: GroupChatModalProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const form = useForm<z.infer<typeof GroupChatSchema>>({
		resolver: zodResolver(GroupChatSchema),
		defaultValues: {
			name: "",
			members: [],
		},
	})

	function onSubmit(values: z.infer<typeof GroupChatSchema>) {
		const { name, members } = values
		startTransition(() => {
			getConversation("", true, members, name)
				.then(() => {
					router.refresh()
					toast.success("Group chat created successfully")
					setIsModalOpen(false)
				})
				.catch(() => {
					toast.error("Failed to create group chat")
				})
		})
	}

	return (
		<Modal
			open={isModalOpen}
			toggle={() => setIsModalOpen((prev) => !prev)}
			title="Create a group chat"
			description="Create a chat with more than 2 people."
			trigger={
				<div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
					<MdOutlineGroupAdd size={20} />
				</div>
			}
			body={
				<Form {...form}>
					<form className="space-y-6 w-96" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="members"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Members</FormLabel>
									<FormControl>
										<MultiSelect
											placeholder="Select members"
											options={users.map((user) => ({
												label: user.name as string,
												value: user.id,
											}))}
											selected={field.value}
											addOption={(option: { value: string; label: string }) => {
												form.setValue("members", [...field.value, option])
											}}
											removeOption={(option: { value: string; label: string }) => {
												form.setValue(
													"members",
													field.value.filter((selected) => selected.value !== option.value)
												)
											}}
											removeLastOption={() => {
												form.setValue("members", field.value.slice(0, -1))
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end items-center gap-2">
							<Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" loading={isPending}>
								Create
							</Button>
						</div>
					</form>
				</Form>
			}
		/>
	)
}
