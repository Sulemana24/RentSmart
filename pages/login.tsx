"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser, FiKey } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_EMAIL_WHITELIST = [
  "simlitechnologies@gmail.com",
  "iddrisusulemana1996@gmail.com",
];

const isAllowedAdminEmail = (email: string) => {
  const e = email.toLowerCase().trim();
  return ADMIN_EMAIL_WHITELIST.includes(e);
};

const AdminAuthForm = ({
  initialMode = "login",
}: {
  initialMode?: "login" | "signup";
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",

    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllowedAdminEmail(loginData.email)) {
      alert("Unauthorized admin email.");
      return;
    }

    try {
      setIsLoading(true);
      const cred = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password,
      );

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        alert("Access denied. Not an admin.");
        await auth.signOut();
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllowedAdminEmail(signupData.email)) {
      alert("This email is not allowed to be admin.");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const cred = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password,
      );

      await setDoc(doc(db, "users", cred.user.uid), {
        fullName: signupData.fullName,
        email: signupData.email,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);

      if (!isAllowedAdminEmail(cred.user.email || "")) {
        alert("Google account not allowed.");
        await auth.signOut();
        return;
      }

      const ref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: cred.user.displayName,
          email: cred.user.email,
          role: "admin",
          createdAt: serverTimestamp(),
        });
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 mt-6">
            <div className="w-16 h-16 rounded-full bg-[#00CFFF]  flex items-center justify-center">
              <FiKey className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === "login" ? "Admin Login" : "Admin Registration"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === "login"
              ? "Access the administration dashboard"
              : "Register as a system administrator"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-colors ${
                mode === "login"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 text-sm font-medium rounded-md transition-colors ${
                mode === "signup"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="admin@rentsmart.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#00CFFF] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#00CFFF] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00CFFF]  text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Login as Admin"
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Advanced options
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google (Admin)
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="admin@rentsmart.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    minLength={8}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-[#00CFFF] bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#00CFFF] focus:ring-2 mt-1"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{" "}
                  <Link
                    href="/admin/terms"
                    className="text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
                  >
                    Admin Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/admin/privacy"
                    className="text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00CFFF]  text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Admin Account...
                  </div>
                ) : (
                  "Register as Admin"
                )}
              </button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === "login" ? "Need admin access?" : "Already an admin?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-[#00CFFF] hover:text-[#FF4FA1] font-medium transition-colors"
              >
                {mode === "login" ? "Request Registration" : "Login here"}
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <FiLock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Security Notice
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Admin access is restricted to authorized personnel only.
                  Unauthorized access attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Main Site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00CFFF] dark:hover:text-[#00CFFF] transition-colors inline-flex items-center gap-1"
            >
              ← Back to main website
            </Link>
          </div>
        </div>

        {/* Admin Features Highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Full Control",
              description: "Manage users, properties, and payments",
              icon: "👑",
            },
            {
              title: "Analytics Dashboard",
              description: "Track platform performance and metrics",
              icon: "📊",
            },
            {
              title: "Security Management",
              description: "Monitor and secure the platform",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthForm;
