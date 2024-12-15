import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
	open: boolean
	onClose: () => void
	title?: string
	description?: string
	body: React.ReactNode
	trigger: React.ReactNode
	className?: string
}

export function Modal({ open, onClose, title, description, body, trigger, className }: ModalProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className={cn("w-fit maxh-[80vh] overflow-y-auto overflow-hidden", className)}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{body}
			</DialogContent>
		</Dialog>
	)
}
