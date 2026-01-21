"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "../ToastProvider";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  onSubmit?: (formData: SignupData) => void;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: "renter" | "homeowner" | "admin";
  agreeToTerms: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "renter",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast({
        title: "Password Mismatch",
        message: "Please ensure your passwords match.",
        type: "error",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      showToast({
        title: "Terms Not Accepted",
        message: "Please agree to the terms and conditions.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.userType,
        createdAt: serverTimestamp(),
        isGoogleAccount: false,
      });

      localStorage.setItem("role", formData.userType);

      if (formData.userType === "renter") {
        router.push("/");
      } else if (formData.userType === "homeowner") {
        router.push("/homeowner");
      } else if (formData.userType === "admin") {
        router.push("/admin");
      }

      showToast({
        title: "Signup Successful",
        message: "Your account has been created successfully!",
        type: "success",
      });
    } catch (error: any) {
      showToast({
        title: "Signup Failed",
        message:
          error.code === "auth/email-already-in-use"
            ? "This email is already registered"
            : error.message || "Signup failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);

    if (!formData.agreeToTerms) {
      showToast({
        title: "Terms Required",
        message:
          "Please agree to the terms and conditions to continue with Google sign-up.",
        type: "error",
      });
      setGoogleLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();

    try {
      // Add additional scopes
      provider.addScope("profile");
      provider.addScope("email");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uid = user.uid;
      const email = user.email || "";
      const displayName = user.displayName || "";

      // Split display name into first and last name
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Check if user already exists
      const userSnap = await getDoc(doc(db, "users", uid));

      if (userSnap.exists()) {
        // User already exists, just sign them in
        const userData = userSnap.data();
        localStorage.setItem("role", userData.role);

        showToast({
          title: "Welcome Back!",
          message: "You already have an account. Signed in successfully.",
          type: "success",
        });

        // Redirect based on existing role
        if (userData.role === "renter") {
          router.push("/");
        } else if (userData.role === "homeowner") {
          router.push("/homeowner");
        } else if (userData.role === "admin") {
          router.push("/admin");
        }
        return;
      }

      // Create new user document with Google sign-up
      await setDoc(doc(db, "users", uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: "", // Google doesn't provide phone number
        role: formData.userType,
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || "",
        isGoogleAccount: true,
      });

      localStorage.setItem("role", formData.userType);

      showToast({
        title: "Account Created!",
        message: "Your account has been created with Google.",
        type: "success",
      });

      // Redirect based on selected user type
      if (formData.userType === "renter") {
        router.push("/");
      } else if (formData.userType === "homeowner") {
        router.push("/homeowner");
      } else if (formData.userType === "admin") {
        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Google sign-up error:", error);

      let errorMessage = "Google sign-up failed";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-up popup was closed";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Popup blocked by browser. Please allow popups for this site.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-up was cancelled";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This Google account is already linked to an existing account";
      }

      showToast({
        title: "Google Sign-up Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case "renter":
        return "Looking to rent properties for short or long term stays";
      case "homeowner":
        return "Want to list and manage your properties for rent";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">
            Join our platform and start your journey
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I want to join as a...
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white mb-2"
              >
                <option value="renter">Renter / Tenant</option>
                <option value="homeowner">Agent / Landlord</option>
              </select>
              <p className="text-xs text-gray-400">
                {getUserTypeDescription(formData.userType)}
                <br />
                <span className="text-[#00CFFF]">
                  Note: Google sign-up will use this selection
                </span>
              </p>
            </div>

            {/* Quick Sign-up Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">
                  Quick sign-up with
                </span>
              </div>
            </div>

            {/* Google Sign-up Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  <FcGoogle className="w-5 h-5" />
                  Sign up with Google
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Contact Information */}
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
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                placeholder="020XXXXXXX"
              />
              <p className="mt-1 text-xs text-gray-400">
                Required for email sign-up. Google accounts can add phone later
                in profile.
              </p>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="••••••••"
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent bg-gray-700 text-white placeholder-gray-400 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00CFFF] transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 text-[#00CFFF] bg-gray-700 border-gray-600 rounded focus:ring-[#00CFFF] focus:ring-2 mt-1"
                required
              />
              <label className="text-sm text-gray-300">
                I agree to the{" "}
                <Link
                  href="terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00CFFF] hover:text-[#FF4FA1] transition-colors"
                >
                  Privacy Policy
                </Link>
                <br />
                <span className="text-xs text-gray-400">
                  (Required for both email and Google sign-up)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full bg-[#FF4FA1] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account with Email"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSwitchToLogin}
              className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200"
            >
              Sign In Instead
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
