"use client";

import { type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/use-auth";

export function NavMain({
	items,
}: {
	items: {
		id: string;
		label: string;
		url: string;
		icon?: LucideIcon;
		adminOnly: boolean;
	}[];
}) {
	const { isAdmin } = useAuthState();
	const router = useRouter();
	const pathname = usePathname();
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					if (item.adminOnly && !isAdmin) return null;

					const activeTab = item.url == pathname;
					return (
						<SidebarMenuItem key={item.id}>
							<SidebarMenuButton
								tooltip={item.label}
								onClick={() => router.push(item.url)}
								isActive={activeTab}
							>
								{item.icon && <item.icon />}
								<span>{item.label}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
