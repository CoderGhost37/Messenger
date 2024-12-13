import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"

import authConfig from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	secret: process.env.AUTH_SECRET as string,
	session: { strategy: "jwt" },
	...authConfig,
})