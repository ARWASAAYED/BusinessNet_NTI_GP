"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const RegisterForm = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user" as "user" | "business",
    category: "Services",
  });

  const categories = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Services",
    "Real Estate",
    "Hospitality",
    "Transportation",
    "Legal",
    "Consulting",
  ];
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await register({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.accountType,
      category:
        formData.accountType === "business" ? formData.category : undefined,
      avatar: avatar || undefined,
    });

    if (!result.success) {
      setError(result.error || "Registration failed");
      setIsLoading(false);
    }
    // Redirection is handled in useAuth hook
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-effect rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 glow-effect ${
              formData.accountType === "business"
                ? "gradient-bg-accent"
                : "gradient-bg-primary"
            }`}
          >
            {formData.accountType === "business" ? (
              <Building2 className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600">
            Join the professional network for businesses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div
                className={`w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${
                  formData.accountType === "business"
                    ? "border-accent-200"
                    : "border-primary-200"
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className={`w-12 h-12 ${
                      formData.accountType === "business"
                        ? "text-accent-300"
                        : "text-primary-300"
                    }`}
                  />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200"
              >
                <span className="text-xs font-bold">Change</span>
              </label>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className={`mt-2 text-xs font-bold uppercase tracking-widest ${
                formData.accountType === "business"
                  ? "text-accent-600"
                  : "text-primary-600"
              }`}
            >
              Upload Photo
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-xl">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                formData.accountType === "user"
                  ? "bg-white text-primary-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setFormData({ ...formData, accountType: "user" })}
            >
              <User className="w-4 h-4 inline mr-2" />
              Individual
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                formData.accountType === "business"
                  ? "bg-white text-accent-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() =>
                setFormData({ ...formData, accountType: "business" })
              }
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Business
            </motion.button>
          </div>

        

          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-500" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-500" />
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-500" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>
            {/* Category Selection - Only for Business */}
          {formData.accountType === "business" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent-500" />
                Business Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-500" />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary-500" />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              formData.accountType === "business"
                ? "gradient-bg-accent hover:shadow-accent-500/50"
                : "gradient-bg-primary hover:shadow-primary-500/50"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-gray-500 rounded-full">
                or
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
