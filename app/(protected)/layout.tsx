import type React from "react"

import { RouteGuard } from "@/components/auth/route-guard"
import { UsernameGate } from "@/components/auth/username-gate"
import { PunditChatProvider } from "@/components/pundit/pundit-chat-provider"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PunditChatProvider>
      <RouteGuard>
        <UsernameGate>{children}</UsernameGate>
      </RouteGuard>
    </PunditChatProvider>
  )
}
