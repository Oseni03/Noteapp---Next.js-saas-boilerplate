"use client";

import { useMemo } from "react";
import { authClient } from "@/lib/auth-client";

export function useAuthState() {
	const {
		data: session,
		isPending: isSessionLoading,
		error: sessionError,
	} = authClient.useSession();
	const user = session?.user;

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
		}),
		[session, isSessionLoading, sessionError, user]
	);
}
