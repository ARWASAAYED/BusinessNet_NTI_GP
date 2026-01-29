"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Save, Building2, MapPin, Globe, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import Input from "../common/Input";
import { Business, UpdateBusinessData } from "@/services/businessService";
import businessService from "@/services/businessService";

interface BusinessEditFormProps {
  business: Business;
  onClose: () => void;
  onSuccess: (updatedBusiness: Business) => void;
}

export default function BusinessEditForm({ business, onClose, onSuccess }: BusinessEditFormProps) {
  const [formData, setFormData] = useState<UpdateBusinessData>({
    name: business.name || "",
    description: business.description || "",
    category: business.category || "",
    website: business.website || "",
    email: business.email || "",
    phone: business.phone || "",
    address: {
      street: business.address?.street || "",
      city: business.address?.city || "",
      state: business.address?.state || "",
      country: business.address?.country || "",
      zipCode: business.address?.zipCode || "",
    },
    socialLinks: {
      facebook: business.socialLinks?.facebook || "",
      twitter: business.socialLinks?.twitter || "",
      linkedin: business.socialLinks?.linkedin || "",
      instagram: business.socialLinks?.instagram || "",
    },
    hashtags: business.hashtags?.map(h => h.name).join(', ') || "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business.logo || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(business.coverImage || null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent: 'address' | 'socialLinks', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSubmit: UpdateBusinessData = {
        ...formData,
        logo: logoFile || undefined,
        coverImage: coverFile || undefined,
      };

      const updated = await businessService.updateBusiness(business._id, dataToSubmit);
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update business profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-primary-500" />
            Edit Business Profile
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form id="edit-business-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Visual Assets */}
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Visual Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Logo</label>
                  <div className="relative group w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors cursor-pointer">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white w-8 h-8" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'logo')} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Cover Image</label>
                  <div className="relative group w-full h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors cursor-pointer">
                     {coverPreview ? (
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Change Cover
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'cover')} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Basic Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Basic Information</h3>
              </div>
              
              <Input
                label="Business Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Category / Industry"
                name="category"
                value={formData.category} // We are editing 'category' but relying on 'industry' in backend logic mostly, but let's stick to what we have
                onChange={handleInputChange}
                required
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-shadow text-gray-900 dark:text-gray-100"
                  placeholder="Describe your business, values, and what you offer..."
                />
              </div>

               <Input
                label="Hashtags (comma separated)"
                name="hashtags"
                value={formData.hashtags || ""}
                onChange={handleInputChange}
                placeholder="tech, innovation, startup"
                className="md:col-span-2"
              />
            </section>

             {/* Contact Info */}
             <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={<Phone className="w-5 h-5" />}
                />
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  icon={<Globe className="w-5 h-5" />}
                  className="md:col-span-2"
                />
                {/* Address Fields */}
                <Input
                  label="City"
                  value={formData.address?.city}
                  onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                  icon={<MapPin className="w-5 h-5" />}
                />
                <Input
                  label="Country"
                  value={formData.address?.country}
                  onChange={(e) => handleNestedChange('address', 'country', e.target.value)}
                />
              </div>
            </section>
            
            {/* Social Links */}
             <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Social Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Facebook"
                  value={formData.socialLinks?.facebook}
                  onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                  icon={<Facebook className="w-5 h-5" />}
                  placeholder="Profile URL"
                />
                <Input
                  label="Twitter / X"
                  value={formData.socialLinks?.twitter}
                  onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                  icon={<Twitter className="w-5 h-5" />}
                  placeholder="Profile URL"
                />
                <Input
                  label="LinkedIn"
                  value={formData.socialLinks?.linkedin}
                  onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                  icon={<Linkedin className="w-5 h-5" />}
                  placeholder="Profile URL"
                />
                <Input
                  label="Instagram"
                  value={formData.socialLinks?.instagram}
                  onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                  icon={<Instagram className="w-5 h-5" />}
                  placeholder="Profile URL"
                />
              </div>
             </section>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 z-10">
          <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="edit-business-form" 
            isLoading={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
