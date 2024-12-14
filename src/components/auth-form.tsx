"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { BsGithub, BsGoogle } from "react-icons/bs"
import type { z } from "zod"

import { login, register, socialLogin } from "@/actions/auth"
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
import { PasswordInput } from "@/components/ui/password-input"
import { AuthScehma } from "@/schema/auth"
import { toast } from "sonner"

export function AuthForm() {
	const [variant, setVariant] = useState<"LOGIN" | "REGISTER">("LOGIN")
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof AuthScehma>>({
		resolver: zodResolver(AuthScehma),
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

	function onSubmit(values: z.infer<typeof AuthScehma>) {
		startTransition(() => {
			if (variant === "LOGIN") {
				login(values).then((res) => {
					if (res.success) {
						toast.success(res.message)
					} else {
						toast.error(res.message)
					}
				})
			} else {
				register(values).then((res) => {
					if (res.success) {
						toast.success(res.message)
					} else {
						toast.error(res.message)
					}
				})
			}
		})
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
										<PasswordInput placeholder="Password" type="password" {...field} />
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
							onClick={() => socialLogin("github")}
						>
							<BsGithub size={20} />
						</Button>

						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => socialLogin("google")}
						>
							<BsGoogle size={20} />
						</Button>
					</div>
				</div>

				<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
					<div>{variant === "LOGIN" ? "New to Messenger?" : "Already have an account?"}</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div onClick={toggleVariant} className="underline cursor-pointer">
						{variant === "LOGIN" ? "Create an account" : "Login"}
					</div>
				</div>
			</div>
		</div>
	)
}
