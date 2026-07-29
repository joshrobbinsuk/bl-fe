"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthLoading } from "@/components/auth/auth-loading"

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/fixtures")
    }
  }, [loading, user, router])

  if (loading || user) {
    return <AuthLoading />
  }

  return <>{children}</>
}
