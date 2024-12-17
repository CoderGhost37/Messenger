"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { updateUser } from "@/actions/users"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
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
import type { SessionUser } from "@/schema/user"
import { UploadDropzone } from "@/utils/uploadthing"

interface SettingsModalProps {
	toggle: () => void
	user: SessionUser | null
}

const formSchema = z.object({
	name: z.string(),
	image: z.string().url(),
})

export function SettingsDrawer({ toggle, user }: SettingsModalProps) {
	const router = useRouter()
	const [isPending, startTranistion] = useTransition()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name || "",
			image: user?.image || "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTranistion(() => {
			updateUser(values.name, values.image)
				.then((res) => {
					if (res.success) {
						toast.success("User updated successfully")
						router.refresh()
					} else {
						toast.error("Failed to update user")
					}
				})
				.finally(() => {
					toggle()
				})
		})
	}

	return (
		<Form {...form}>
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Profile Image</FormLabel>
							<FormControl>
								<div className="flex flex-col sm:flex-row items-center gap-6">
									<Avatar className="h-16 w-16">
										<AvatarImage
											src={field.value || "/images/placeholder.jpg"}
											className="object-cover"
										/>
									</Avatar>
									<UploadDropzone
										endpoint="imageUploader"
										content={{
											allowedContent({
												isUploading,
											}: {
												isUploading: boolean
											}) {
												if (isUploading) {
													return "Uploading..."
												}
											},
										}}
										onClientUploadComplete={async (res: any) => {
											field.onChange(res[0].url)
										}}
										onUploadError={() => {
											toast.error("Upload failed")
										}}
										appearance={{
											uploadIcon: "hidden",
											container: "px-8 py-4 w-96 h-60 cursor-pointer hover:bg-gray-100",
											button: "bg-sky-500 text-white py-1 px-3 text-sm",
										}}
										className="h-40"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end items-center gap-2">
					<Button variant="outline" type="button" onClick={toggle}>
						Cancel
					</Button>
					<Button type="submit" loading={isPending}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	)
}
