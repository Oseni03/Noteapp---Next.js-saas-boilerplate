"use server";

import { auth } from "@/lib/auth";
import { isAdmin } from "./permissions";

export const addMember = async (
	organizationId: string,
	userId: string,
	role: "member" | "admin" | ("member" | "admin")[]
) => {
	try {
		const data = await auth.api.addMember({
			body: {
				userId,
				organizationId,
				role,
			},
		});
		return { success: true, data };
	} catch (error) {
		console.error(error);
		return { success: false, error };
	}
};

export const removeMember = async (
	organizationId: string,
	memberId: string
) => {
	const { success } = await isAdmin();

	if (!success) {
		return {
			success: false,
			error: "You are not authorized to remove members.",
		};
	}

	try {
		const data = await auth.api.removeMember({
			body: {
				organizationId,
				memberIdOrEmail: memberId,
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

export async function updateMemberRole(
	memberId: string,
	organizationId: string,
	role: "admin" | "member" | ("admin" | "member")[]
) {
	try {
		const { success } = await isAdmin();

		if (!success) {
			return {
				success: false,
				error: "You are not authorized to remove members.",
			};
		}

		const result = await auth.api.updateMemberRole({
			body: {
				role, // required
				memberId, // required
				organizationId,
			},
		});
		return { data: result, success: true };
	} catch (error) {
		console.error("Error creating organization: ", error);
		return { success: false, error };
	}
}
