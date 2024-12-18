"use client"

import { X } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
	value: string
	label: string
}

interface MultiSelectProps {
	placeholder: string
	options: Option[]
	selected: Option[]
	addOption: (option: Option) => void
	removeOption: (option: Option) => void
	removeLastOption: () => void
}

export function MultiSelect({
	placeholder,
	options,
	selected,
	addOption,
	removeOption,
	removeLastOption,
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState("")

	const selectables = React.useMemo(() => {
		return options.filter((opt) => !selected.some((sel) => sel.value === opt.value))
	}, [options, selected])

	const handleUnselect = React.useCallback((opt: Option) => {
		removeOption(opt)
	}, [])

	const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current
		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					removeLastOption()
				}
			}
			// This is not a default behaviour of the <input /> field
			if (e.key === "Escape") {
				input.blur()
			}
		}
	}, [])

	return (
		<Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
			<div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex flex-wrap gap-1">
					{selected.map((item) => {
						return (
							<Badge key={item.value} variant="secondary">
								{item.label}
								<button
									type="button"
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(item)
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault()
										e.stopPropagation()
									}}
									onClick={() => handleUnselect(item)}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						)
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				<CommandList>
					{open && selectables.length > 0 ? (
						<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
							<CommandGroup className="h-full overflow-auto">
								{selectables.map((opt) => {
									return (
										<CommandItem
											key={opt.value}
											onMouseDown={(e) => {
												e.preventDefault()
												e.stopPropagation()
											}}
											onSelect={() => {
												setInputValue("")
												addOption(opt)
											}}
											className={"cursor-pointer"}
										>
											{opt.label}
										</CommandItem>
									)
								})}
							</CommandGroup>
						</div>
					) : null}
				</CommandList>
			</div>
		</Command>
	)
}
