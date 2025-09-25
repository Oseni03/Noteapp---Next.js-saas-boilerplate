// Layout page
"use client";

import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import { useSubscriptionStore } from "@/zustand/providers/subscription-store-provider";

export default function Page({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { setActiveOrganization, setOrganizations } = useOrganizationStore(
		(state) => state
	);
	const { loadSubscription } = useSubscriptionStore((state) => state);
	const { data: session } = authClient.useSession();
	const { data: organizations } = authClient.useListOrganizations();

	// Move the state update to useEffect to avoid calling it during render
	useEffect(() => {
		if (session?.activeOrganizationId) {
			setActiveOrganization(session.activeOrganizationId);
			loadSubscription(session.activeOrganizationId);
		}
		if (organizations) {
			setOrganizations(organizations);
		}
	}, [
		session?.activeOrganizationId,
		setActiveOrganization,
		organizations,
		setOrganizations,
		loadSubscription,
	]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
