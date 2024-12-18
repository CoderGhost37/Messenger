import { getToken } from "next-auth/jwt"
import { type NextRequest, NextResponse } from "next/server"

import { authRoutes, restrictedRoutes } from "@/routes"

export default async function middleware(req: NextRequest) {
	const { nextUrl } = req

	const user = await getToken({
		req,
		secret: process.env.AUTH_SECRET as string,
		secureCookie: process.env.NODE_ENV === "production",
		salt:
			process.env.NODE_ENV === "production"
				? "__Secure-authjs.session-token"
				: "authjs.session-token",
	})

	if (authRoutes.includes(nextUrl.pathname)) {
		if (user) {
			return NextResponse.redirect(new URL("/users", nextUrl.toString()))
		}

		return NextResponse.next()
	}

	if (
		restrictedRoutes.includes(nextUrl.pathname) ||
		nextUrl.pathname.startsWith("/conversations")
	) {
		if (!user) {
			return NextResponse.redirect(new URL("/", nextUrl.toString()))
		}

		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
}
