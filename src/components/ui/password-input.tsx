"use client"

import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false)
		return (
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					className={cn(
						"flex h-9 w-full rounded border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
				/>
				<div className="absolute right-0 top-1.5 flex items-center pr-3 text-2xl leading-5">
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="text-gray-500 hover:text-gray-700 focus:outline-none"
					>
						{showPassword ? <EyeOff /> : <Eye />}
					</button>
				</div>
			</div>
		)
	}
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
