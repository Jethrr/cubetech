"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Store } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOrders = pathname?.startsWith("/admin/orders") ?? false;

  return (
    <SidebarProvider className="min-h-svh lg:h-svh lg:overflow-hidden">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-4" />
            </span>
            <span className="text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              CubeTech Admin
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isOrders}
                    tooltip="Orders"
                    render={<Link href="/admin/orders" />}
                  >
                    <ClipboardList />
                    <span>Orders</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="lg:overflow-hidden">
        <div className="flex flex-1 flex-col lg:min-h-0 lg:overflow-y-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
