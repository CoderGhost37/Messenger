"use client"

import { useConversation } from "@/hooks/use-conversation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { HiPaperAirplane } from "react-icons/hi2"
import { z } from "zod"

import { sendMessage } from "@/actions/conversations"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
	message: z.string().nonempty("Message is required"),
})

export function MessageInput() {
	const { conversationId } = useConversation()
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(() => {
			sendMessage(conversationId, values.message).then(() => {
				form.reset()
			})
		})
	}

	return (
		<div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-center gap-2 lg:gap-4 w-full"
				>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input required placeholder="Write a message" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						disabled={isPending}
						className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
					>
						{isPending ? (
							<Loader2 size={18} className="text-white animate-spin" />
						) : (
							<HiPaperAirplane size={18} className="text-white" />
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}
