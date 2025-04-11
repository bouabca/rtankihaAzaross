"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Server,
  KeyRound,
  History,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
          
        </div>
        <SidebarTrigger aria-label="Toggle sidebar" />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/devices")}
              tooltip="Devices"
            >
              <Link href="/devices">
                <Server className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">Devices</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/rfid")}
              tooltip="RFID Cards"
            >
              <Link href="/rfid">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">RFID Cards</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/access-logs")}
              tooltip="Access Logs"
            >
              <Link href="/access-logs">
                <History className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">Access Logs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/analytics")}
              tooltip="Analytics"
            >
              <Link href="/analytics">
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              tooltip="Settings"
            >
              <Link href="/settings">
                <Settings className="h-5 w-5" aria-hidden="true" />
                <span className="hidden md:inline">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile">
            <User className="h-5 w-5" aria-hidden="true" />
          </Button>
          <ModeToggle aria-label="Toggle mode" />
          <Button variant="ghost" size="icon" aria-label="Log out">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
