"use server";

import { auth } from "@/lib/auth";

export const createInvitation = async (
	organizationId: string,
	email: string,
	role: "member" | "admin" | ("member" | "admin")[]
) => {
	try {
		const data = await auth.api.createInvitation({
			body: {
				email,
				role,
				organizationId,
				resend: true,
			},
		});
		return { success: true, data };
	} catch (error) {
		console.error(error);
		return { success: false, error };
	}
};

export const cancelInvitation = async (invitationId: string) => {
	try {
		const data = await auth.api.cancelInvitation({
			body: {
				invitationId,
			},
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error,
		};
	}
};

export const acceptInvitation = async (invitationId: string) => {
	try {
		const data = await auth.api.rejectInvitation({
			body: {
				invitationId,
			},
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error,
		};
	}
};

export const rejectInvitation = async (invitationId: string) => {
	try {
		const data = await auth.api.rejectInvitation({
			body: {
				invitationId,
			},
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error,
		};
	}
};
