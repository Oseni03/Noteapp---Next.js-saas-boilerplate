"use server";

import { auth } from "@/lib/auth";
import { isAdmin } from "./permissions";
import { prisma } from "@/lib/prisma";

export const addMember = async (
	organizationId: string,
	userId: string,
	role: "member" | "admin" | ("member" | "admin")[]
) => {
	try {
		await auth.api.addMember({
			body: {
				userId,
				organizationId,
				role,
			},
		});
	} catch (error) {
		console.error(error);
		throw new Error("Failed to add member.");
	}
};

export const removeMember = async (memberId: string) => {
	const admin = await isAdmin();

	if (!admin) {
		return {
			success: false,
			error: "You are not authorized to remove members.",
		};
	}

	try {
		await prisma.member.delete({ where: { id: memberId } });

		return {
			success: true,
			error: null,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: "Failed to remove member.",
		};
	}
};
