"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCallback, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { BsGithub, BsGoogle } from "react-icons/bs"
import { z } from "zod"

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

const formSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
})

export function AuthForm() {
	const router = useRouter()
	const [variant, setVariant] = useState<"LOGIN" | "REGISTER">("LOGIN")
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	})

	const toggleVariant = useCallback(() => {
		if (variant === "LOGIN") {
			setVariant("REGISTER")
		} else {
			setVariant("LOGIN")
		}
	}, [variant])

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(() => {
			if (variant === "LOGIN") {
				// Login
			} else {
				// Register
			}
		})
	}

	const socialAction = (action: string) => {
		// Social login
	}

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						{variant === "REGISTER" && (
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
						)}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email" type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="Password" type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div>
							<Button type="submit" loading={isPending} className="w-full">
								{variant === "LOGIN" ? "Sign in" : "Register"}
							</Button>
						</div>
					</form>
				</Form>

				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">Or continue with</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => socialAction("github")}
						>
							<BsGithub size={20} />
						</Button>

						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => socialAction("google")}
						>
							<BsGoogle size={20} />
						</Button>
					</div>
				</div>

				<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
					<div>{variant === "LOGIN" ? "New to Messenger?" : "Already have an account?"}</div>
					<div onClick={toggleVariant} className="underline cursor-pointer">
						{variant === "LOGIN" ? "Create an account" : "Login"}
					</div>
				</div>
			</div>
		</div>
	)
}
