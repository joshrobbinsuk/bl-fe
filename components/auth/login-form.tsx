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
import { setPendingConfirmEmail } from "@/lib/pending-confirm"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, resendSignUpCode } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const goConfirm = async () => {
    setPendingConfirmEmail(email)
    try {
      await resendSignUpCode(email)
    } catch {
      // Resend can fail (e.g. rate limit); the code screen still lets them retry.
    }
    toast({
      title: "Confirm your email first",
      description: "We've sent you a fresh confirmation code.",
    })
    router.push("/confirm")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn(email, password)
      // Amplify v6 doesn't throw for an unconfirmed user — it returns a
      // CONFIRM_SIGN_UP next step. Route them into the confirm flow instead of
      // treating it as a successful login.
      if (result?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        await goConfirm()
        return
      }
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/fixtures")
    } catch (error: any) {
      // Older Cognito setups throw instead of returning the next step.
      if (error.name === "UserNotConfirmedException") {
        await goConfirm()
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to login",
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
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
