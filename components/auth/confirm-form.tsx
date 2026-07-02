"use client";

import type React from "react";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  clearPendingConfirmEmail,
  getPendingConfirmEmail,
} from "@/lib/pending-confirm";

const RESEND_COOLDOWN_SECONDS = 30;

const emptySubscribe = () => () => {};

export function ConfirmForm() {
  const pendingEmail = useSyncExternalStore(
    emptySubscribe,
    () => getPendingConfirmEmail() ?? "",
    () => "",
  );
  const [typedEmail, setTypedEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { confirmSignUp, resendSignUpCode } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const email = pendingEmail || typedEmail;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      clearPendingConfirmEmail();
      toast({
        title: "Confirmed",
        description: "You're all set — log in to get started.",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "We need your email to resend the code.",
        variant: "destructive",
      });
      return;
    }

    try {
      await resendSignUpCode(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast({
        title: "Code sent",
        description: `A fresh code is on its way to ${email}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Confirm your account</CardTitle>
        <CardDescription>
          {pendingEmail
            ? `Enter the confirmation code we sent to ${pendingEmail}.`
            : "Enter your email and the confirmation code we sent you."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConfirm} className="space-y-4">
          {!pendingEmail && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={typedEmail}
                onChange={(e) => setTypedEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="code">Confirmation code</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Confirming..." : "Confirm account"}
          </Button>
        </form>
        <Button
          type="button"
          variant="ghost"
          className="mt-2 w-full"
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </Button>
      </CardContent>
    </Card>
  );
}
