"use server"

import bcrypt from "bcryptjs"
import type { z } from "zod"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AuthScehma } from "@/schema/auth"

export async function register(values: z.infer<typeof AuthScehma>) {
	const validatedFields = AuthScehma.safeParse(values)

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid fields",
		}
	}

	const { name, email, password } = validatedFields.data

	try {
		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

		return {
			success: true,
			message: "Account created successfully",
			user,
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.message,
		}
	}
}

export async function login(values: z.infer<typeof AuthScehma>) {
	const validatedFields = AuthScehma.safeParse(values)

	if (!validatedFields.success) {
		return {
			success: false,
			message: "Invalid fields",
		}
	}

	const { email, password } = validatedFields.data

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		})

		return {
			success: true,
			message: "Logged in successfully",
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.message,
		}
	}
}
