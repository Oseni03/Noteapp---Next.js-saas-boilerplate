"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	User,
	Building2,
	Users2,
	LineChart,
	CreditCard,
	Settings2,
} from "lucide-react";
import OrganizationCard from "@/components/settings/organizations";
import SubscriptionCard from "@/components/settings/subscription";
import { UsageCard } from "@/components/settings/usage";
import { QuickActions } from "@/components/settings/quick-actions";
import { UserProfileCard } from "@/components/settings/user-profile";
import { MembersCard } from "@/components/settings/members";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extract the component that uses useSearchParams into a separate component
const SettingsContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const defaultTab = searchParams.get("tab") || "profile";
	const [tab, setTab] = useState(defaultTab);

	useEffect(() => {
		const urlTab = searchParams.get("tab");
		if (urlTab && urlTab !== tab) {
			setTab(urlTab);
		}
	}, [searchParams, tab]);

	const handleTabChange = (value: string) => {
		setTab(value);
		router.push(`/dashboard/settings?tab=${value}`);
	};

	return (
		<div className="p-4 sm:p-6 space-y-6 mx-auto">
			{/* Header */}
			<div>
				<h1 className="text-xl sm:text-2xl font-bold text-foreground">
					Settings
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">
					Manage your profile, organization settings, and team members
				</p>
			</div>

			<Tabs
				value={tab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 mb-6 -mx-4 sm:mx-0 px-4 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
					<TabsTrigger
						value="profile"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<User className="h-4 w-4 flex-shrink-0" />
						<span>Profile</span>
					</TabsTrigger>
					<TabsTrigger
						value="organization"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<Building2 className="h-4 w-4 flex-shrink-0" />
						<span>Organization</span>
					</TabsTrigger>
					<TabsTrigger
						value="members"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<Users2 className="h-4 w-4 flex-shrink-0" />
						<span>Members</span>
					</TabsTrigger>
					<TabsTrigger
						value="usage"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<LineChart className="h-4 w-4 flex-shrink-0" />
						<span>Usage</span>
					</TabsTrigger>
					<TabsTrigger
						value="subscription"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<CreditCard className="h-4 w-4 flex-shrink-0" />
						<span>Subscription</span>
					</TabsTrigger>
					<TabsTrigger
						value="actions"
						className="flex items-center gap-2 min-w-[120px] sm:min-w-0 whitespace-nowrap"
					>
						<Settings2 className="h-4 w-4 flex-shrink-0" />
						<span>Actions</span>
					</TabsTrigger>
				</TabsList>

				<div className="-mx-4 sm:mx-0">
					<TabsContent
						value="profile"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<UserProfileCard />
					</TabsContent>

					<TabsContent
						value="organization"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<OrganizationCard />
					</TabsContent>

					<TabsContent
						value="members"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<MembersCard />
					</TabsContent>

					<TabsContent
						value="usage"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<UsageCard />
					</TabsContent>

					<TabsContent
						value="subscription"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<SubscriptionCard />
					</TabsContent>

					<TabsContent
						value="actions"
						className="space-y-4 sm:space-y-6 px-4 sm:px-0"
					>
						<QuickActions />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
};

// Loading fallback component
const SettingsLoading = () => (
	<div className="p-4 sm:p-6 space-y-6 mx-auto">
		<div>
			<h1 className="text-xl sm:text-2xl font-bold text-foreground">
				Settings
			</h1>
			<p className="text-sm sm:text-base text-muted-foreground">
				Loading...
			</p>
		</div>
	</div>
);

// Main page component with Suspense boundary
const Page = () => {
	return (
		<Suspense fallback={<SettingsLoading />}>
			<SettingsContent />
		</Suspense>
	);
};

export default Page;
