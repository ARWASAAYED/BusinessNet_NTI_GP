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
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/LanguageProvider";

const RegisterForm = () => {
  const { register } = useAuth();
  const { t, isRTL } = useLanguage();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      setError(t('auth.passwordsMismatch') || "Passwords do not match");
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
      setError(result.error || t('auth.registrationFailed') || "Registration failed");
      setIsLoading(false);
    }
  };

  const isBusiness = formData.accountType === "business";

  // Shared input class
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none text-sm";
  const labelClass =
    "text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-secondary-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative text-center mb-7">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-xl ${
              isBusiness
                ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
                : "bg-gradient-to-br from-primary-500 to-secondary-600 shadow-primary-500/30"
            }`}
          >
            {isBusiness ? (
              <Building2 className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-1.5 tracking-tight">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative group">
              <div
                className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center bg-white/5 ${
                  isBusiness ? "border-amber-500/40" : "border-primary-500/40"
                }`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-600" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200"
              >
                <Camera className="w-5 h-5" />
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
              className={`mt-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                isBusiness
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-primary-400 hover:text-primary-300"
              }`}
            >
              {t('auth.uploadPhoto')}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Account Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                !isBusiness
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              onClick={() => setFormData({ ...formData, accountType: "user" })}
            >
              <User className="w-4 h-4" />
              {t('auth.individual') || t('auth.personal') || 'Individual'}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              className={`py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isBusiness
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              onClick={() =>
                setFormData({ ...formData, accountType: "business" })
              }
            >
              <Building2 className="w-4 h-4" />
              {t('auth.business') || t('auth.businessAccount') || 'Business'}
            </motion.button>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <User className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.fullName')}
            </label>
            <input
              type="text"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <User className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.username')}
            </label>
            <input
              type="text"
              placeholder="johndoe"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <Mail className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.email')}
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Category (business only) */}
          <AnimatePresence>
            {isBusiness && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label className={labelClass}>
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  {t('auth.businessCategory')}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-gray-900 text-white focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 outline-none text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900 text-white">
                      {t(`categories.${cat}`, cat)}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <Lock className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <Lock className="w-3.5 h-3.5 text-primary-400" />
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${
              isBusiness
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/20"
                : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-primary-500/20"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {t('auth.register')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-gray-600 text-xs font-bold uppercase tracking-widest">
                {t('auth.orContinue')}
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-500">
            {t('auth.hasAccount')}{" "}
            <Link
              href="/login"
              className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t('auth.login')}
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
