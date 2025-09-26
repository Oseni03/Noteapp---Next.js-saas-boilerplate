"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_PLAN, SUBSCRIPTION_PLANS } from "@/lib/utils";
import { headers } from "next/headers";

export async function createFreeSubscription(organizationId: string) {
	const freePlan = FREE_PLAN;
	if (!freePlan) throw new Error("Free plan not found in subscription plans");

	const now = new Date();
	const currentPeriodEnd = new Date();
	currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

	await prisma.subscription.create({
		data: {
			organizationId,
			status: "active",
			amount: 0,
			currency: "USD",
			recurringInterval: "yearly",
			currentPeriodStart: now,
			currentPeriodEnd,
			cancelAtPeriodEnd: false,
			startedAt: now,
			customerId: `free_${organizationId}`,
			productId: freePlan.productId,
			checkoutId: `free_${organizationId}`,
			createdAt: now,
		},
	});
}

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
