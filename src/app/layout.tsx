import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

const siteConfig = {
	title: "Messenger",
	description: "A simple messenger app",
	url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
}

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.title}`,
	},
	description: "A simple messenger app",
	robots: { index: true, follow: true },
	icons: {
		icon: `${siteConfig.url}/favicon/favicon.ico`,
		shortcut: `${siteConfig.url}/favicon/favicon-16x16.png`,
		apple: `${siteConfig.url}/favicon/apple-touch-icon.png`,
	},
	manifest: `${siteConfig.url}/favicon/site.webmanifest`,
	openGraph: {
		url: siteConfig.url,
		title: siteConfig.title,
		description: siteConfig.description,
		siteName: siteConfig.title,
		images: [`${siteConfig.url}/images/og.png`],
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.title,
		description: siteConfig.description,
		images: [`${siteConfig.url}/images/og.png`],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	)
}
