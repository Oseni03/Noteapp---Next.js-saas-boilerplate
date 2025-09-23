"use client";

import React, { useState } from "react";
import { User, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth";
import { toast } from "sonner";

export const UserProfileCard = () => {
	const { user, updateUserProfile } = useAuthState();
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
			await updateUserProfile(formData);
			toast.success("Profile updated successfully");
			setIsEditing(false);
		} catch (error) {
			console.log("Error updating profile: ", error);
			toast.error("Failed to update profile: ");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					User Profile
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
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
							/>
						</div>
						<div>
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
							/>
						</div>
						<div className="flex gap-2">
							<Button type="submit" disabled={isLoading}>
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
							>
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium block">
								Name
							</label>
							<p className="text-muted-foreground">
								{user?.name}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium block">
								Email
							</label>
							<p className="text-muted-foreground">
								{user?.email}
							</p>
						</div>
						<Button onClick={() => setIsEditing(true)}>
							Edit Profile
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
