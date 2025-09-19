"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/types";

export function useAuthState() {
	const {
		data: session,
		isPending: isSessionLoading,
		error: sessionError,
	} = authClient.useSession();
	const [activeOrganization, setActiveOrganization] =
		useState<Organization | null>(null);

	useEffect(() => {
		const getActiveOrganization = async () => {
			try {
				const response = await fetch("/api/organizations/get-active");

				const result = await response.json();

				if (result.success) {
					setActiveOrganization(result.data);
				}
			} catch (error) {
				console.error(error);
			}
		};

		getActiveOrganization();
	}, []);

	const user = session?.user;
	const members = activeOrganization?.members;

	return useMemo(
		() => ({
			// Raw data
			session,
			user,
			activeOrganization,
			members,

			// Loading states
			isLoading: isSessionLoading,
			isSessionLoading,

			// Error states
			sessionError,
			hasError: !!sessionError,

			// Computed auth states
			isAuthenticated: !!user,
			isAdmin: user?.role === "admin",
			// isOwner: activeOrganization?.ownerId === user?.id,
			isMember: members?.some((member) => member.userId === user?.id),

			// Organization stats
			memberCount: members?.length || 0,
			adminCount: members?.filter((m) => m.role === "admin").length || 0,

			// User display info
			userDisplayName: user?.name || user?.email || "Anonymous",
			userInitials: user?.name
				? user.name
						.split(" ")
						.map((n) => n[0])
						.join("")
						.toUpperCase()
				: user?.email?.[0].toUpperCase() || "?",
		}),
		[
			session,
			activeOrganization,
			isSessionLoading,
			sessionError,
			user,
			members,
		]
	);
}
