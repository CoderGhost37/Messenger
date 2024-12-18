import { type NextRequest, NextResponse } from "next/server"

import { getUser } from "@/actions/auth"
import { pusherServer } from "@/lib/pusher"

export const POST = async (request: NextRequest) => {
	const user = await getUser()

	if (!user || !user.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	const body = await request.text()
	const values = body.split("&")

	const socketId = values[0].split("=")[1]
	const channel = values[1].split("=")[1]
	const data = {
		user_id: user.email,
	}

	const authResponse = pusherServer.authorizeChannel(socketId, channel, data)

	return NextResponse.json(authResponse)
}
