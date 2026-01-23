"use client";

import { useState } from "react";
import { useToast } from "../ToastProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast({
        title: "Email Required",
        message: "Please enter your registered email.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);

      showToast({
        title: "Reset Email Sent",
        message: `Check your email (${email}) to reset your password.`,
        type: "success",
      });

      setEmail("");
    } catch (error: any) {
      showToast({
        title: "Reset Failed",
        message:
          error.code === "auth/user-not-found"
            ? "No account found with this email."
            : error.message || "Failed to send reset email.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF4FA1] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="/auth"
              className="text-[#00CFFF] hover:text-[#FF4FA1] text-sm transition-colors"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
