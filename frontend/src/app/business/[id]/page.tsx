import React from "react";
import BusinessDetailContent from "@/components/business/BusinessDetailContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Profile | Business Social Network",
  description: "View detailed business profile, offerings, reputation, and connect with verified businesses on Business Social Network.",
};

export default function BusinessDetailPage() {
  return <BusinessDetailContent />;
}
