import type React from "react"

import { AuthRedirect } from "@/components/auth/auth-redirect"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthRedirect>{children}</AuthRedirect>
}
