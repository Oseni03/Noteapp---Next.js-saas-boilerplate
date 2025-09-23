"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";

export function useAuthState() {
	const {
		data: session,
		isPending: isSessionLoading,
		error: sessionError,
	} = authClient.useSession();
	const { members } = useOrganizationStore((state) => state);

	const user = session?.user;

	const isAdmin = !!members?.find(
		(member) => member.userId == user?.id && member.role == "admin"
	);

	const updateUserProfile = async (values: {
		name: string;
		image?: string;
	}) => {
		try {
			const data = await authClient.updateUser({
				name: values.name,
				image: values.image,
			});

			return data;
		} catch (error) {
			console.log("Error updating profile: ", error);
			return { status: false, message: "Failed to update profile" };
		}
	};

	return useMemo(
		() => ({
			// Raw data
			session,
			user,

			// Loading states
			isLoading: isSessionLoading,
			isSessionLoading,

			// Error states
			sessionError,
			hasError: !!sessionError,

			// Computed auth states
			isAuthenticated: !!user,
			isAdmin,

			// Actions
			updateUserProfile,
		}),
		[session, isSessionLoading, sessionError, user, isAdmin]
	);
}
