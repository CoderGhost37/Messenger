import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type DefaultSession } from "next-auth"

import authConfig from "@/auth.config"
import { getuserById } from "./actions/auth"

type ExtendedUser = DefaultSession["user"] & {
	name: string
	image: string | null
}

declare module "next-auth" {
	interface Session {
		user: ExtendedUser
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		name: string
		image: string | null
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),

	callbacks: {
		async jwt({ token, trigger, session }) {
			if (!token.sub) {
				return token
			}

			const existingUser = await getuserById(token.sub)

			if (!existingUser) {
				return token
			}

			token.name = existingUser.name || ""
			token.image = existingUser.image

			if (trigger === "update" && session?.image) {
				token.image = session.image
			}

			if (trigger === "update" && session?.name) {
				token.name = session.name
			}

			return token
		},
		async session({ token, session }) {
			if (token.sub) {
				session.user = {
					...session.user,
					id: token.sub,
					name: token.name || "",
					image: token.image || null,
				}
			}
			return session
		},
	},
	secret: process.env.AUTH_SECRET as string,
	session: { strategy: "jwt" },
	...authConfig,
})
