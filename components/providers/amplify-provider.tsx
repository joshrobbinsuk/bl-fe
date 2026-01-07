"use client"

import type React from "react"

import { Amplify } from "aws-amplify"
import { amplifyConfig } from "@/lib/amplify-config"
import { useEffect } from "react"

Amplify.configure(amplifyConfig, { ssr: true })

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure Amplify on client side
    Amplify.configure(amplifyConfig)
  }, [])

  return <>{children}</>
}
