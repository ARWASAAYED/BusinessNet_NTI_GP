"use client";

import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "../common/Button";

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  isLoading?: boolean;
}

export default function CheckoutForm({ amount, onSuccess, isLoading: externalLoading }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-6 border border-primary-100 dark:border-primary-800">
        <p className="text-sm text-primary-700 dark:text-primary-400 font-bold mb-1">Payment Amount</p>
        <p className="text-2xl font-black text-primary-600">${amount}</p>
      </div>

      <PaymentElement id="payment-element" />
      
      <Button
        disabled={isLoading || !stripe || !elements || externalLoading}
        className="w-full py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-500/20"
        isLoading={isLoading}
      >
        Pay Now
      </Button>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('succeeded') ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
}
