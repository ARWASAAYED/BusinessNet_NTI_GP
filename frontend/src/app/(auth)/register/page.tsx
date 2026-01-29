import RegisterForm from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Business Social Network',
  description: 'Join Business Social Network and create your free account to connect with industry leaders, share insights, and grow your professional network.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
