import LoginForm from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Business Social Network',
  description: 'Sign in to your Business Social Network account to connect with industry leaders and grow your professional network.',
};

export default function LoginPage() {
  return <LoginForm />;
}
