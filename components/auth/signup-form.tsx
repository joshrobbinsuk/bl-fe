"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp, resendSignUpCode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const goConfirm = (description: string) => {
    toast({ title: "Almost there", description })
    router.push(`/confirm?email=${encodeURIComponent(email)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      goConfirm("Check your email for a confirmation code.")
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        // Email already registered — but confirmed or abandoned? Probe with a
        // resend: it succeeds for an unconfirmed account and throws for a
        // confirmed one, so we route each to where it can actually get in.
        try {
          await resendSignUpCode(email)
          goConfirm("Looks like you already started — here's a fresh code.")
        } catch {
          toast({
            title: "You already have an account",
            description: "Log in instead.",
          })
          router.push("/login")
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign up",
          variant: "destructive",
        })
      }
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
              required
            />
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
      </CardContent>
    </Card>
  )
}
