"use client";

import { useState, useEffect } from "react";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Mount-time auth probe: setState happens after an await, which is the
    // intended pattern here. A full fix means sourcing auth from an external
    // store (useSyncExternalStore / RTK Query) — out of scope for now.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkUser();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn({ username: email, password });
    await checkUser();
    return result;
  };

  const handleSignUp = async (email: string, password: string) => {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    return result;
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    await confirmSignUp({ username: email, confirmationCode: code });
  };

  const handleResendSignUpCode = async (email: string) => {
    await resendSignUpCode({ username: email });
  };

  const handleResetPassword = async (email: string) => {
    return resetPassword({ username: email });
  };

  const handleConfirmResetPassword = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    resendSignUpCode: handleResendSignUpCode,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    signOut: handleSignOut,
  };
}
