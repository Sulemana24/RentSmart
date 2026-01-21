"use client";

import { useState } from "react";
import LoginForm, { LoginData } from "../components/auth/LoginForm";
import SignupForm, { SignupData } from "../components/auth/SignupForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { loginUser, signupUser, getUserRole } from "@/lib/auth";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (data: LoginData) => {
    try {
      const user = await loginUser(data.email, data.password);
      const role = await getUserRole(user.uid);

      if (!role) throw new Error("User role not found");

      localStorage.setItem("role", role);

      if (role === "renter") router.push("/");
      if (role === "homeowner") router.push("/homeowner");
      if (role === "admin") router.push("/admin");
    } catch (err: any) {
      showToast({
        title: "Login failed",
        message: err.message || "Invalid credentials",
        type: "error",
      });
    }
  };

  // 🆕 SIGNUP
  const handleSignup = async (data: SignupData) => {
    try {
      if (data.userType === "admin") {
        throw new Error("Admin accounts are created internally");
      }

      const user = await signupUser(data.email, data.password, data);

      localStorage.setItem("role", data.userType);

      if (data.userType === "renter") router.push("/");
      if (data.userType === "homeowner") router.push("/homeowner");

      showToast({
        title: "Signup Successful",
        message: `Welcome ${data.firstName}!`,
        type: "success",
      });
    } catch (err: any) {
      showToast({
        title: "Signup failed",
        message: err.message || "Something went wrong",
        type: "error",
      });
    }
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
