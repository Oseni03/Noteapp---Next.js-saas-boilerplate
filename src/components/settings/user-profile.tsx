"use client";

import React, { useState } from "react";
import { User, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const UserProfileCard = () => {
	const { user } = useAuthState();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const data = await authClient.updateUser({
				name: formData.name,
			});

			if (!data.error && data.data) {
				toast.success("Profile updated successfully");
				setIsEditing(false);
			} else {
				throw new Error(
					data.error?.message || "Failed to update profile"
				);
			}
		} catch (error) {
			console.log("Error updating profile: ", error);
			toast.error("Failed to update profile: ");
		} finally {
			setIsLoading(false);
		}
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
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">Name</label>
							<Input
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								placeholder="Your name"
								className="w-full sm:max-w-md"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Email</label>
							<Input
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								placeholder="Your email"
								type="email"
								disabled
								className="w-full sm:max-w-md"
							/>
						</div>
						<div className="flex flex-col sm:flex-row gap-2 pt-2">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full sm:w-auto"
							>
								{isLoading ? (
									<>Saving...</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Save Changes
									</>
								)}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditing(false)}
								className="w-full sm:w-auto"
							>
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<div className="space-y-1">
							<label className="text-sm font-medium block">
								Name
							</label>
							<p className="text-base text-muted-foreground">
								{user?.name}
							</p>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-medium block">
								Email
							</label>
							<p className="text-base text-muted-foreground break-all">
								{user?.email}
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
};
