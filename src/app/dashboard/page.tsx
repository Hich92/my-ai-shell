import { LuxPageWrapper } from "@/components/layout/lux-page-wrapper";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const menuItems = [
    { number: "01", label: "Executive Summary", href: "/dashboard/summary" },
    { number: "02", label: "System Resources", href: "/dashboard/resources" },
    { number: "03", label: "Operational Integrity", href: "/dashboard/integrity" },
  ];

  return (
    <LuxPageWrapper 
      title="Command Center"
      subtitle="Total Control & Monitoring · AI-Shell v.Luxe"
      icon={LayoutDashboard}
      items={menuItems}
    />
  );
}
