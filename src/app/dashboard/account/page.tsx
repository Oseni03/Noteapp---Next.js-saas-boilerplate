"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ProfileForm } from "@/components/forms/profile-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	const [isEditing, setIsEditing] = useState(false);

	// Handle loading state
	if (isPending) {
		return (
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="flex items-center gap-2">
						<User className="h-4 w-4 sm:h-5 sm:w-5" />
						User Profile
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-5 w-48" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-5 w-64" />
					</div>
				</CardContent>
			</Card>
		);
	}

	// Handle no user state
	if (!user) {
		return (
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="flex items-center gap-2">
						<User className="h-4 w-4 sm:h-5 sm:w-5" />
						User Profile
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						No user data available
					</p>
				</CardContent>
			</Card>
		);
	}

	const handleSuccess = async () => {
		// Refetch session data to update the displayed information
		await authClient.getSession();
		setIsEditing(false);
	};

	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="flex items-center gap-2">
					<User className="h-4 w-4 sm:h-5 sm:w-5" />
					User Profile
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<ProfileForm
						initialData={{
							name: user.name || "",
							email: user.email || "",
						}}
						onCancel={() => setIsEditing(false)}
						onSuccess={handleSuccess}
					/>
				) : (
					<div className="space-y-4">
						<div className="space-y-1">
							<label className="text-sm font-medium block">
								Name
							</label>
							<p className="text-base text-muted-foreground">
								{user.name || "Not provided"}
							</p>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-medium block">
								Email
							</label>
							<p className="text-base text-muted-foreground break-all">
								{user.email || "Not provided"}
							</p>
						</div>
						<Button
							onClick={() => setIsEditing(true)}
							className="w-full sm:w-auto mt-2"
						>
							Edit Profile
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
