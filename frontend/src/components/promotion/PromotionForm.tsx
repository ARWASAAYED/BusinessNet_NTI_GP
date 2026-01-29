"use client";

import React, { useState } from 'react';
import { DollarSign, Calendar, Target, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

import promotionService from '@/services/promotionService';
import api from '@/services/api';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PromotionFormProps {
  postId: string;
  postContent: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PromotionForm({ postId, postContent, onSuccess, onCancel }: PromotionFormProps) {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState('100');
  const [duration, setDuration] = useState('7');
  const [targetAudience, setTargetAudience] = useState('Technology');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  const categories = ['Technology', 'Business', 'Finance', 'Design', 'Marketing'];

  const initializePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/payments/create-intent', {
        amount: parseFloat(budget),
        promotionType: 'post',
        targetId: postId
      });

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
        setStep(4); // Move to payment step
      }
    } catch (error: any) {
      console.error('Failed to init payment:', error);
      setError(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizePromotion = async () => {
    setIsLoading(true);
    try {
      await promotionService.createPromotion({
        postId,
        budget: parseFloat(budget),
        duration: parseInt(duration),
        targetCategory: targetAudience
      });
      onSuccess();
    } catch (error: any) {
      setError('Promotion created but dashboard sync failed. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const appearance = { theme: 'stripe' as const };
  const options = { clientSecret, appearance };

  return (
    <Card className="max-w-xl mx-auto overflow-hidden">
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 flex">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-primary-500' : ''}`} 
          />
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Configure Campaign</h2>
                <p className="text-sm text-gray-500">Set your budget and duration for this promotion.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Total Budget (USD)
                  </label>
                  <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="E.g. 100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Duration (Days)
                  </label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100">
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full flex items-center justify-center gap-2 py-6 rounded-2xl">
                Next: Targeting <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Target Audience</h2>
                <p className="text-sm text-gray-500">Choose who should see your promoted post.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setTargetAudience(cat)} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${targetAudience === cat ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <Target className={`w-5 h-5 ${targetAudience === cat ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${targetAudience === cat ? 'text-primary-900 dark:text-primary-100' : 'text-gray-600 dark:text-gray-400'}`}>{cat}</span>
                    </div>
                    {targetAudience === cat && <Check className="w-5 h-5 text-primary-600" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1 rounded-2xl py-6">Back</Button>
                <Button onClick={nextStep} className="flex-[2] rounded-2xl py-6">Review & Pay</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Review Campaign</h2>
                <p className="text-sm text-gray-500">Double check everything before payment.</p>
              </div>
              <Card className="p-4 bg-gray-50 dark:bg-gray-900/50 border-none space-y-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Post Content</span><span className="text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{postContent}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Targeting</span><span className="text-gray-900 dark:text-gray-100 font-bold">{targetAudience}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Duration</span><span className="text-gray-900 dark:text-gray-100 font-bold">{duration} Days</span></div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between"><span className="text-gray-900 dark:text-gray-100 font-bold">Total Cost</span><span className="text-xl font-bold text-primary-600">${budget}.00</span></div>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1 rounded-2xl py-6">Back</Button>
                <Button onClick={initializePayment} isLoading={isLoading} className="flex-[2] rounded-2xl py-6 gradient-bg-primary">
                  💳 Proceed to Payment
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && clientSecret && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Secure Checkout</h2>
                <p className="text-sm text-gray-500">Enter your card details to launch the campaign.</p>
              </div>
              <Elements stripe={stripePromise} options={options}>
                 <CheckoutForm amount={parseFloat(budget)} onSuccess={finalizePromotion} isLoading={isLoading} />
              </Elements>
              <Button variant="ghost" onClick={prevStep} className="w-full" disabled={isLoading}>
                Cancel and Review
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {error && <p className="mt-4 text-center text-red-500 text-sm font-bold">{error}</p>}
      </div>
    </Card>
  );
}
