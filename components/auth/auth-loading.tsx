import { Wordmark } from "@/components/layout/wordmark"
import { Spinner } from "@/components/ui/spinner"

export function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Wordmark className="text-5xl text-primary" />
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )
}
