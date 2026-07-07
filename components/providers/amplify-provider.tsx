"use client"

import type React from "react"

import { Amplify } from "aws-amplify"
import { amplifyConfig } from "@/lib/amplify-config"

Amplify.configure(amplifyConfig)

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
