"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export async function handleSubscriptionCreated(payload: any) {
	const referenceId = payload.data.metadata?.reference_id;
	if (!referenceId) return;

	await prisma.subscription.create({
		data: {
			organizationId: referenceId,
			polarSubscriptionId: payload.data.id,
			status: payload.data.status,
			planName: payload.data.product?.name || "Unknown",
			amount: payload.data.price?.price_amount || 0,
			currency: payload.data.currency || "USD",
			currentPeriodEnd: new Date(payload.data.current_period_end),
		},
	});
}

export async function handleSubscriptionUpdated(payload: any) {
	await prisma.subscription.update({
		where: { polarSubscriptionId: payload.data.id },
		data: {
			status: payload.data.status,
			currentPeriodEnd: new Date(payload.data.current_period_end),
			cancelAtPeriodEnd: payload.data.cancel_at_period_end || false,
		},
	});
}

export async function handleSubscriptionCanceled(payload: any) {
	await prisma.subscription.update({
		where: { polarSubscriptionId: payload.data.id },
		data: {
			status: "canceled",
			cancelAtPeriodEnd: true,
		},
	});
}
