import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Business Social Network',
  description: 'Reset your password to regain access to your Business Social Network account.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

