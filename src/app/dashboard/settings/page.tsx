"use client";

import React from "react";
import { Shield } from "lucide-react";
import { useAuthState } from "@/hooks/use-auth";
import OrganizationCard from "@/components/settings/organizations";
import SubscriptionCard from "@/components/settings/subscription";
import { UsageCard } from "@/components/settings/usage";
import { QuickActions } from "@/components/settings/quick-actions";

const Page = () => {
	const { isAdmin, isLoading, hasError, sessionError, orgError } =
		useAuthState();

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
							{sessionError?.message ||
								orgError?.message ||
								"An error occurred"}
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
					Manage your organization settings and subscription
				</p>
			</div>

			{/* Organization Info - Components now use their own hooks */}
			<OrganizationCard />

			{/* Usage & Limits */}
			<UsageCard />

			{/* Subscription Details */}
			<SubscriptionCard />

			{/* Quick Actions */}
			<QuickActions />
		</div>
	);
};

export default Page;
