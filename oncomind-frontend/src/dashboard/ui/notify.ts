import { toast } from "sonner";

type NotifyType = "info" | "success" | "error" | "warning";

/**
 * Drop-in replacement for `devextreme/ui/notify` — same (message, type, duration)
 * signature, so every existing call site keeps working unchanged.
 */
export default function notify(message: string, type: NotifyType = "info", duration = 2000) {
     toast[type](message, { duration });
}
