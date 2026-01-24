"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "../ToastProvider";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSubmit?: (formData: LoginData) => void;
}

export interface LoginData {
  email: string;
  password: string;
  userType: "renter" | "homeowner" | "hostel" | "admin";
}

export const saveUserToFirestore = async (
  user: any,
  role: string,
  extraData?: any,
) => {
  const uid = user.uid;
  const userSnap = await getDoc(doc(db, "users", uid));

  if (!userSnap.exists()) {
    const firstName =
      extraData?.firstName || user.displayName?.split(" ")[0] || "";
    const lastName =
      extraData?.lastName ||
      user.displayName?.split(" ").slice(1).join(" ") ||
      "";
    const phone = extraData?.phone || "";
    const isGoogleAccount = !!user.providerData.find((p: any) =>
      p.providerId.includes("google"),
    );
    const photoURL = user.photoURL || "";
    const hostelName = extraData?.hostelName || "";

    const userData: any = {
      uid,
      email: user.email,
      firstName,
      lastName,
      phone,
      role,
      isGoogleAccount,
      photoURL,
      createdAt: serverTimestamp(),
    };

    // Add hostel-specific fields if needed
    if (role === "hostel") {
      userData.hostelName = hostelName;
    }

    await setDoc(doc(db, "users", uid), userData);
  }

  return getDoc(doc(db, "users", uid));
};

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onSubmit,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
    userType: "renter",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const uid = userCred.user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));

      if (!userSnap.exists()) {
        throw new Error("User profile not found");
      }

      const { role } = userSnap.data();

      if (role === "renter") {
        router.push("/");
      } else if (role === "homeowner") {
        router.push("/homeowner/page");
      } else if (role === "hostel") {
        router.push("/student/page");
      } else if (role === "admin") {
        router.push("/admin");
      }

      showToast({
        title: "Login Successful",
        message: "Welcome back!",
        type: "success",
      });
    } catch (error: any) {
      showToast({
        title: "Login Failed",
        message:
          error.code === "auth/invalid-credential"
            ? "Invalid email or password"
            : error.message || "Login failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uid = user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));

      let role: string;

      if (!userSnap.exists()) {
        const userDoc = await saveUserToFirestore(user, formData.userType);
        role = userDoc.data()!.role;

        showToast({
          title: "Account Created",
          message: "Your account has been created successfully!",
          type: "success",
        });
      } else {
        role = userSnap.data().role;

        showToast({
          title: "Login Successful",
          message: "Welcome back!",
          type: "success",
        });
      }

      if (role === "renter") router.replace("/");
      else if (role === "homeowner") router.replace("/homeowner/page");
      else if (role === "hostel") router.replace("/student/page");
      else if (role === "admin") router.replace("/admin");
    } catch (error: any) {
      console.error("Google login error:", error);

      let errorMessage = "Google login failed";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login popup was closed";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Popup blocked by browser. Please allow popups for this site.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Login was cancelled";
      }

      showToast({
        title: "Google Login Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I am a...
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white"
              >
                <option value="renter">Renter / Tenant</option>
                <option value="homeowner">Agent / Landlord</option>
                <option value="hostel">Hostel Manager</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Note: Google sign-in will use this selection for new accounts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00CFFF] transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#00CFFF] bg-gray-700 border-gray-600 rounded focus:ring-[#00CFFF] focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full bg-[#FF4FA1] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 mr-2"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <FcGoogle className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  New to our platform?
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToSignup}
              className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200"
            >
              Create New Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
