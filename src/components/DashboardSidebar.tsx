import { Home, Heart, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface DashboardSidebarProps {
  activeSection: 'memes' | 'watchlist' | 'referral';
  setActiveSection: (section: 'memes' | 'watchlist' | 'referral') => void;
}

export function DashboardSidebar({ activeSection, setActiveSection }: DashboardSidebarProps) {
  const menuItems = [
    {
      title: "My Memes",
      id: 'memes' as const,
      icon: Home,
    },
    {
      title: "Watchlist",
      id: 'watchlist' as const,
      icon: Heart,
    },
    {
      title: "Referral Program",
      id: 'referral' as const,
      icon: Users,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    data-active={activeSection === item.id}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}