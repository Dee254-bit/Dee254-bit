import type { Metadata } from "next"
import DashboardContent from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | PDF Master",
  description: "Your PDF Master dashboard",
}

export default function DashboardPage() {
  return <DashboardContent />
}
