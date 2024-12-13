import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

import { prisma } from "@/lib/prisma"
import { AuthScehma } from "@/schema/auth"

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Github({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		}),
		Credentials({
			async authorize(credentials) {
				const validateFields = AuthScehma.safeParse(credentials)

				if (validateFields.success) {
					const { email, password } = validateFields.data

					const user = await prisma.user.findUnique({
						where: {
							email,
						},
					})

					if (!user || !user?.password) {
						throw new Error("User not found")
					}

					const isCorrectPassword = await bcrypt.compare(password, user.password)

					if (!isCorrectPassword) {
						throw new Error("Invalid credentials")
					}

					return user
				}
				throw new Error("Invalid fields")
			},
		}),
	],
} satisfies NextAuthConfig
