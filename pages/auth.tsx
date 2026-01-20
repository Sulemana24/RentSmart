"use client";
import { useState } from "react";
import LoginForm, { LoginData } from "../components/auth/LoginForm";
import SignupForm, { SignupData } from "../components/auth/SignupForm";
import { useRouter } from "next/router";
import { useToast } from "@/components/ToastProvider";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = (data: LoginData) => {
    localStorage.setItem("role", data.userType);

    switch (data.userType) {
      case "renter":
        router.push("/");
        break;
      case "homeowner":
        router.push("/homeowner");
        break;
      case "admin":
        router.push("/admin");
        break;
    }
  };

  const handleSignup = (data: SignupData) => {
    console.log("Signup attempt:", data);
    switch (data.userType) {
      case "renter":
        window.location.href = "/";
        break;
      case "homeowner":
        window.location.href = "/homeowner";
        break;
      case "admin":
        window.location.href = "/admin";
        break;
    }

    showToast({
      title: "Signup Successful",
      message: `Welcome ${data.firstName}! Your ${data.userType} account has been created.`,
      type: "success",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {authMode === "login" ? (
        <LoginForm
          onSwitchToSignup={() => setAuthMode("signup")}
          onSubmit={handleLogin}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setAuthMode("login")}
          onSubmit={handleSignup}
        />
      )}
    </div>
  );
}
