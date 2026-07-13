"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FirebaseError } from "firebase/app"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleSignInButton } from "@/components/auth/google-button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

const MIN_PASSWORD_LENGTH = 6

function signupErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Log in instead."
    case "auth/weak-password":
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    case "auth/invalid-email":
      return "That email address doesn't look right."
    default:
      return "Failed to sign up."
  }
}

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: "Error",
        description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      // Straight-in: no email verification. RouteGuard/UsernameGate send
      // first-run users to /welcome.
      router.push("/fixtures")
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : ""
      toast({
        title: "Error",
        description: signupErrorMessage(code),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to start betting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
            <p className="text-xs text-muted-foreground">At least 6 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <GoogleSignInButton />
      </CardContent>
    </Card>
  )
}
