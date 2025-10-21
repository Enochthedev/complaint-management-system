import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Student Portal",
    template: "%s | Student Portal",
  },
  description: "Student portal for UI CS Complaint System",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
