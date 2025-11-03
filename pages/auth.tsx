"use client";
import { useState } from "react";
import LoginForm, { LoginData } from "../components/auth/LoginForm";
import SignupForm, { SignupData } from "../components/auth/SignupForm";
import { useRouter } from "next/router";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const router = useRouter();

  const handleLogin = (data: LoginData) => {
    // Save role temporarily
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
        // Redirect to renter dashboard
        window.location.href = "/";
        break;
      case "homeowner":
        // Redirect to homeowner dashboard
        window.location.href = "/homeowner";
        break;
      case "admin":
        // Redirect to admin dashboard
        window.location.href = "/admin";
        break;
    }

    alert(
      `Welcome ${data.firstName}! Your ${data.userType} account has been created.`
    );
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
