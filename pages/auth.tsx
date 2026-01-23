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
      else if (role === "homeowner") router.push("/homeowner");
      else if (role === "hostel") router.push("/hostel/page");
      else if (role === "admin") router.push("/admin");

      showToast({
        title: "Login Successful",
        message: `Welcome back!`,
        type: "success",
      });
    } catch (err: any) {
      showToast({
        title: "Login failed",
        message: err.message || "Invalid credentials",
        type: "error",
      });
    }
  };

  const handleSignup = async (data: SignupData) => {
    try {
      if (data.userType === "admin") {
        throw new Error("Admin accounts are created internally");
      }

      const user = await signupUser(data.email, data.password, data);

      localStorage.setItem("role", data.userType);

      if (data.userType === "renter") router.push("/");
      else if (data.userType === "homeowner") router.push("/homeowner");
      else if (data.userType === "hostel") router.push("/hostel/page");

      const welcomeName =
        data.userType === "hostel"
          ? `Welcome ${data.hostelName}!`
          : `Welcome ${data.firstName}!`;

      showToast({
        title: "Signup Successful",
        message: welcomeName,
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
