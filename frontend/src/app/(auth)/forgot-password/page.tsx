import ForgotPassword from '@/components/auth/ForgotPassword';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Business Social Network',
  description: 'Reset your password by requesting a password reset link sent to your email address.',
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
