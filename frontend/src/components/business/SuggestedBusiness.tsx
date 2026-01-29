"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import businessService, { Business } from "@/services/businessService";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Spinner from "../common/Spinner";
import Button from "../common/Button";

export default function SuggestedBusiness() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await businessService.getByCategory("All", 1, 3);
        setBusinesses(data.businesses || []);
      } catch (error) {
        console.error("Failed to load businesses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBusinesses();
  }, []);

  const handleBusinessClick = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  return (
    <Card className="p-4 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg text-white shadow-md shadow-primary-500/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-gray-100">
            Top Businesses
          </h2>
        </div>
        <button
          onClick={() => router.push("/business")}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
        >
          See all
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map((business) => (
            <div key={business._id} className="flex items-center gap-3">
              <div
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleBusinessClick(business._id)}
              >
                <Avatar src={business.logo} alt={business.name} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleBusinessClick(business._id)}
                >
                  {business.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {business.category}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-full text-xs"
                onClick={() => handleBusinessClick(business._id)}
              >
                View
              </Button>
            </div>
          ))}

          <button
            onClick={() => router.push("/business")}
            className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors group"
          >
            Find more businesses
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </Card>
  );
}
