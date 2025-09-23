"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/lib/utils";
import { headers } from "next/headers";

export async function upgradeSubscription(
	organizationId: string,
	plan: string
) {
	try {
		const tenant = await prisma.organization.findFirst({
			where: { id: organizationId },
		});

		// Validate required fields
		if (!tenant) {
			throw new Error("Invalid tenant ID");
		}

		const subscriptionPlan = SUBSCRIPTION_PLANS.find((p) => p.id == plan);

		// Validate required fields
		if (!subscriptionPlan) {
			throw new Error("Subscription plan not found");
		}

		const data = await auth.api.updateOrganization({
			body: {
				data: {
					subscription: subscriptionPlan.id,
					maxNotes: subscriptionPlan.maxNotes,
					maxUsers: subscriptionPlan.maxUsers,
				},
				organizationId: tenant.id,
			},
			headers: await headers(),
		});

		return {
			success: true,
			data,
		};
	} catch (error) {
		console.log("Error updating tenant subscription: ", error);
		return { success: false, error };
	}
}
