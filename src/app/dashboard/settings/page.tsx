"use client";

import React from "react";
import {
	Shield,
	User,
	Building2,
	Users2,
	LineChart,
	CreditCard,
	Settings2,
} from "lucide-react";
import { useAuthState } from "@/hooks/use-auth";
import OrganizationCard from "@/components/settings/organizations";
import SubscriptionCard from "@/components/settings/subscription";
import { UsageCard } from "@/components/settings/usage";
import { QuickActions } from "@/components/settings/quick-actions";
import { UserProfileCard } from "@/components/settings/user-profile";
import { MembersCard } from "@/components/settings/members";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
	const { isAdmin, isLoading, hasError, sessionError } = useAuthState();

	// Handle errors
	if (hasError) {
		return (
			<div className="p-6">
				<div className="text-center py-12">
					<div className="text-red-500 mb-4">
						<h2 className="text-xl font-semibold">
							Error Loading Settings
						</h2>
						<p className="text-sm mt-2">
							{sessionError?.message || "An error occurred"}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Show loading state
	if (isLoading) {
		return (
			<div className="p-6">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// Check admin access
	if (!isAdmin) {
		return (
			<div className="p-6">
				<div className="text-center py-12">
					<Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						Access Restricted
					</h2>
					<p className="text-muted-foreground">
						You need admin privileges to view settings.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-foreground">Settings</h1>
				<p className="text-muted-foreground">
					Manage your profile, organization settings, and team members
				</p>
			</div>

			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid grid-cols-6 gap-4 mb-6">
					<TabsTrigger
						value="profile"
						className="flex items-center gap-2"
					>
						<User className="h-4 w-4" />
						Profile
					</TabsTrigger>
					<TabsTrigger
						value="organization"
						className="flex items-center gap-2"
					>
						<Building2 className="h-4 w-4" />
						Organization
					</TabsTrigger>
					<TabsTrigger
						value="members"
						className="flex items-center gap-2"
					>
						<Users2 className="h-4 w-4" />
						Members
					</TabsTrigger>
					<TabsTrigger
						value="usage"
						className="flex items-center gap-2"
					>
						<LineChart className="h-4 w-4" />
						Usage
					</TabsTrigger>
					<TabsTrigger
						value="subscription"
						className="flex items-center gap-2"
					>
						<CreditCard className="h-4 w-4" />
						Subscription
					</TabsTrigger>
					<TabsTrigger
						value="actions"
						className="flex items-center gap-2"
					>
						<Settings2 className="h-4 w-4" />
						Actions
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="space-y-6">
					<UserProfileCard />
				</TabsContent>

				<TabsContent value="organization" className="space-y-6">
					<OrganizationCard />
				</TabsContent>

				<TabsContent value="members" className="space-y-6">
					<MembersCard />
				</TabsContent>

				<TabsContent value="usage" className="space-y-6">
					<UsageCard />
				</TabsContent>

				<TabsContent value="subscription" className="space-y-6">
					<SubscriptionCard />
				</TabsContent>

				<TabsContent value="actions" className="space-y-6">
					<QuickActions />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Page;
