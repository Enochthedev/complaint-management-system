import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account for UI CS Complaint System",
  openGraph: {
    title: "Register - UI CS Complaint System",
    description: "Create your account to start submitting complaints",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
