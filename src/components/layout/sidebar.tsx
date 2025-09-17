"use client";

import React from "react";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	FileText,
	Users,
	Settings,
	Building2,
	Crown,
	ChevronDown,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar: React.FC = () => {
	const { currentTenant, currentUser, tenants, switchTenant } =
		useAppContext();
	const router = useRouter();
	const pathname = usePathname();

	const getSubscriptionColor = (subscription: string) => {
		switch (subscription) {
			case "enterprise":
				return "bg-gradient-to-r from-purple-500 to-purple-600";
			case "pro":
				return "bg-gradient-to-r from-blue-500 to-blue-600";
			default:
				return "bg-gradient-to-r from-gray-400 to-gray-500";
		}
	};

	const menuItems = [
		{ id: "notes", label: "Notes", icon: FileText, href: "/dashboard" },
		{
			id: "users",
			label: "Users",
			icon: Users,
			adminOnly: true,
			href: "/dashboard/users",
		},
		{
			id: "settings",
			label: "Settings",
			icon: Settings,
			adminOnly: true,
			href: "/dashboard/settings",
		},
	];

	return (
		<div className="w-64 bg-card border-r border-border h-screen flex flex-col">
			{/* Tenant Selector */}
			<div className="p-4 border-b border-border">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="w-full justify-between h-auto p-3"
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
									<Building2 className="w-4 h-4 text-primary-foreground" />
								</div>
								<div className="text-left">
									<div className="font-medium text-sm">
										{currentTenant?.name}
									</div>
									<div className="text-xs text-muted-foreground capitalize">
										{currentTenant?.subscription} Plan
									</div>
								</div>
							</div>
							<ChevronDown className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-64">
						{tenants.map((tenant) => (
							<DropdownMenuItem
								key={tenant.id}
								onClick={() => switchTenant(tenant.id)}
								className="p-3"
							>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-3">
										<div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
											<Building2 className="w-3 h-3 text-primary" />
										</div>
										<div>
											<div className="font-medium text-sm">
												{tenant.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{tenant.domain}
											</div>
										</div>
									</div>
									<Badge
										variant="secondary"
										className={`text-xs ${getSubscriptionColor(
											tenant.subscription
										)} text-white border-0`}
									>
										{tenant.subscription ===
											"enterprise" && (
											<Crown className="w-3 h-3 mr-1" />
										)}
										{tenant.subscription}
									</Badge>
								</div>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4">
				<div className="space-y-2">
					{menuItems.map((item) => {
						if (item.adminOnly && currentUser?.role !== "admin")
							return null;

						const activeTab = item.href == pathname;

						return (
							<Button
								key={item.id}
								variant={activeTab ? "secondary" : "ghost"}
								className="w-full justify-start gap-3 h-10"
								onClick={() => router.push(item.href)}
							>
								<item.icon className="w-4 h-4" />
								{item.label}
							</Button>
						);
					})}
				</div>
			</nav>

			{/* User Info */}
			<div className="p-4 border-t border-border">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
						<span className="text-sm font-medium text-primary-foreground">
							{currentUser?.name.charAt(0)}
						</span>
					</div>
					<div className="flex-1 min-w-0">
						<div className="font-medium text-sm truncate">
							{currentUser?.name}
						</div>
						<div className="text-xs text-muted-foreground truncate">
							{currentUser?.email}
						</div>
					</div>
					<Badge
						variant={
							currentUser?.role === "admin"
								? "default"
								: "secondary"
						}
						className="text-xs"
					>
						{currentUser?.role}
					</Badge>
				</div>
			</div>
		</div>
	);
};
