"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const handleSignUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const handleSignInWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider());

  const handleResetPassword = (email: string) =>
    sendPasswordResetEmail(auth, email);

  const handleSignOut = () => signOut(auth);

  return {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
  };
}
