"use client";

import * as React from "react";
import { FileText, Settings, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

// This is sample data.
const menuItems = [
	{
		id: "notes",
		label: "Notes",
		icon: FileText,
		url: "/dashboard",
		adminOnly: false,
	},
	{
		id: "users",
		label: "Users",
		icon: Users,
		adminOnly: true,
		url: "/dashboard/users",
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings,
		adminOnly: true,
		url: "/dashboard/settings",
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={menuItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
