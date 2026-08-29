import React from "react";
import DashboardLayout from "./components/DashboardLayout";

export const metadata = {
  title: "Dashboard Admin — mb.ai",
  description: "Panel administrasi portal layanan akademik dosen dan asisten AI.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
