"use client";
import { useState } from "react";
import LoginForm, { LoginData } from "../components/auth/LoginForm";
import SignupForm, { SignupData } from "../components/auth/SignupForm";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const handleLogin = (data: LoginData) => {
    console.log("Login attempt:", data);
    // Handle login logic here
    // Redirect based on user type
    switch (data.userType) {
      case "renter":
        // Redirect to renter dashboard
        window.location.href = "/";
        break;
      case "homeowner":
        // Redirect to homeowner dashboard
        window.location.href = "/homeowner-dashboard";
        break;
      case "admin":
        // Redirect to admin dashboard
        window.location.href = "/admin-dashboard";
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
        window.location.href = "/homeowner-dashboard";
        break;
      case "admin":
        // Redirect to admin dashboard
        window.location.href = "/admin-dashboard";
        break;
    }
    // Handle signup logic here
    // After successful signup, you might want to:
    // - Send verification email
    // - Redirect to appropriate dashboard
    // - Show success message
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
