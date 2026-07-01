import type React from "react"

import { RouteGuard } from "@/components/auth/route-guard"
import { UsernameGate } from "@/components/auth/username-gate"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RouteGuard>
      <UsernameGate>{children}</UsernameGate>
    </RouteGuard>
  )
}
