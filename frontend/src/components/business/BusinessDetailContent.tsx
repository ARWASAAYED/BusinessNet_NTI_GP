"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BusinessProfile from "./BusinessProfile";
import Button from "../common/Button";

export default function BusinessDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BusinessProfile businessId={id} />
      </div>
    </div>
  );
}
