"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./users";

export async function getOrganizations() {
	const { currentUser } = await getCurrentUser();

	const members = await prisma.member.findMany({
		where: {
			userId: currentUser.id,
		},
	});

	const organizations = await prisma.organization.findMany({
		where: {
			members: {
				some: {
					id: {
						in: members.map((member) => member.id),
					},
				},
			},
		},
	});

	return organizations;
}

export async function getActiveOrganization(userId: string) {
	const memberUser = await prisma.member.findFirst({
		where: {
			userId: userId,
		},
	});

	if (!memberUser) {
		return null;
	}

	const activeOrganization = await prisma.organization.findFirst({
		where: { id: memberUser.organizationId },
	});

	return { ...activeOrganization, role: memberUser.role };
}

export async function getOrganizationBySlug(slug: string) {
	try {
		const organizationBySlug = await prisma.organization.findUnique({
			where: { slug },
			include: {
				members: {
					include: {
						user: true,
					},
				},
			},
		});

		return organizationBySlug;
	} catch (error) {
		console.error(error);
		return null;
	}
}
