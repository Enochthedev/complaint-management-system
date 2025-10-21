import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your UI CS Complaint System account",
  openGraph: {
    title: "Login - UI CS Complaint System",
    description: "Access your account to submit and track complaints",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
