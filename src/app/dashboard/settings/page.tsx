"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Building2,
	Crown,
	Users,
	FileText,
	Calendar,
	Shield,
	Zap,
} from "lucide-react";
import { format } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Note } from "@/types";

const Page = () => {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const { data: session } = authClient.useSession();
	const [notes] = useState<Note[]>([]);

	const user = session?.user;
	const members = activeOrganization?.members;

	if (user?.role !== "admin") {
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

	const tenantNotes = notes.filter(
		(note) => note.organizationId === activeOrganization?.id
	);

	const getSubscriptionIcon = (subscription: string) => {
		switch (subscription) {
			case "enterprise":
				return <Crown className="w-5 h-5 text-purple-500" />;
			case "pro":
				return <Zap className="w-5 h-5 text-blue-500" />;
			default:
				return <Building2 className="w-5 h-5 text-gray-500" />;
		}
	};

	const getSubscriptionFeatures = (subscription: string) => {
		switch (subscription) {
			case "enterprise":
				return [
					"Unlimited users",
					"1000 notes",
					"Priority support",
					"Advanced analytics",
					"Custom integrations",
				];
			case "pro":
				return [
					"25 users",
					"500 notes",
					"Email support",
					"Team collaboration",
					"API access",
				];
			default:
				return [
					"5 users",
					"50 notes",
					"Basic support",
					"Essential features",
				];
		}
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-foreground">Settings</h1>
				<p className="text-muted-foreground">
					Manage your organization settings and subscription
				</p>
			</div>

			{/* Organization Info */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="w-5 h-5" />
						Organization Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Name
							</label>
							<div className="text-lg font-medium">
								{activeOrganization?.name}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Domain
							</label>
							{/* <div className="text-lg font-medium">
								{activeOrganization?.domain}
							</div> */}
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Created
							</label>
							<div className="text-lg font-medium">
								{activeOrganization &&
									format(
										activeOrganization.createdAt,
										"MMMM d, yyyy"
									)}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Plan
							</label>
							{/* <div className="flex items-center gap-2">
								{activeOrganization &&
									getSubscriptionIcon(
										activeOrganization.subscription
									)}
								<Badge
									variant="secondary"
									className="capitalize"
								>
									{activeOrganization?.subscription}
								</Badge>
							</div> */}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Usage & Limits */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="w-5 h-5" />
						Usage & Limits
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Users</span>
							<span className="font-medium">
								{members?.length} /{" "}
								{activeOrganization?.maxUsers}
							</span>
						</div>
						<Progress
							value={
								(members?.length /
									(activeOrganization?.maxUsers || 1)) *
								100
							}
							className="h-2"
						/>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Notes</span>
							<span className="font-medium">
								{tenantNotes.length} /{" "}
								{activeOrganization?.maxNotes}
							</span>
						</div>
						<Progress
							value={
								(tenantNotes.length /
									(activeOrganization?.maxNotes || 1)) *
								100
							}
							className="h-2"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Subscription Details */}
			{/* <Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{activeOrganization &&
							getSubscriptionIcon(currentTenant.subscription)}
						Subscription Plan
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold capitalize">
								{currentTenant?.subscription} Plan
							</h3>
							<p className="text-muted-foreground">
								Perfect for{" "}
								{currentTenant?.subscription === "enterprise"
									? "large organizations"
									: currentTenant?.subscription === "pro"
									? "growing teams"
									: "small teams"}
							</p>
						</div>
						<Button variant="outline" disabled>
							{currentTenant?.subscription === "enterprise"
								? "Contact Sales"
								: "Upgrade Plan"}
						</Button>
					</div>

					<div className="border-t pt-4">
						<h4 className="font-medium mb-3">Features included:</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{currentTenant &&
								getSubscriptionFeatures(
									currentTenant.subscription
								).map((feature, index) => (
									<div
										key={index}
										className="flex items-center gap-2 text-sm"
									>
										<div className="w-1.5 h-1.5 rounded-full bg-primary" />
										{feature}
									</div>
								))}
						</div>
					</div>
				</CardContent>
			</Card> */}

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Button
							variant="outline"
							className="justify-start h-auto p-4"
							disabled
						>
							<div className="flex items-center gap-3">
								<Users className="w-5 h-5" />
								<div className="text-left">
									<div className="font-medium">
										Invite Team Members
									</div>
									<div className="text-sm text-muted-foreground">
										Add new users to your organization
									</div>
								</div>
							</div>
						</Button>

						<Button
							variant="outline"
							className="justify-start h-auto p-4"
							disabled
						>
							<div className="flex items-center gap-3">
								<FileText className="w-5 h-5" />
								<div className="text-left">
									<div className="font-medium">
										Export Data
									</div>
									<div className="text-sm text-muted-foreground">
										Download your notes and data
									</div>
								</div>
							</div>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Page;
