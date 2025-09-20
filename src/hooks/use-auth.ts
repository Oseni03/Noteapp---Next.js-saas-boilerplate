"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import { Organization } from "@/types";

export function useAuthState() {
	const {
		data: session,
		isPending: isSessionLoading,
		error: sessionError,
	} = authClient.useSession();
	const { data } = authClient.useActiveOrganization();
	const activeOrganization = data as Organization;

	const user = session?.user;
	const members = data?.members;
	const invitations = data?.invitations;

	const isAdmin = !!members?.find(
		(member) => member.userId == user?.id && member.role == "admin"
	);

	return useMemo(
		() => ({
			// Raw data
			session,
			user,
			activeOrganization,
			members,
			invitations,

			// Loading states
			isLoading: isSessionLoading,
			isSessionLoading,

			// Error states
			sessionError,
			hasError: !!sessionError,

			// Computed auth states
			isAuthenticated: !!user,
			isAdmin,
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
			isAdmin,
			members,
			invitations,
		]
	);
}
