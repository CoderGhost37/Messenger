import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

export function Loader() {
	return (
		<Dialog>
			<DialogContent className="bg-transparent">
				<div className="animate-spin">
					<Loader2 size={24} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
