/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { getPlan, getPlanByProductId } from "@/lib/utils";

// Helper function for safe date parsing
function safeParseDate(dateString: string | null | undefined): Date | null {
	if (!dateString) return null;
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}

export async function handleSubscriptionCreated(payload: any) {
	console.log("🎯 Processing subscription.created:", payload.data.id);

	// Extract organization ID from customer data
	const organizationId = payload.data.metadata?.referenceId;
	if (!organizationId) {
		console.error("❌ No referenceId found in metadata");
		return;
	}

	// Get the plan details
	const plan = getPlanByProductId(payload.data.product?.id || "");
	if (!plan) {
		console.error("❌ Invalid plan iD: ", payload.data.product?.name);
		return;
	}

	try {
		console.log(`📦 Creating subscription with plan: ${plan.id}`);
		await prisma.subscription.create({
			data: {
				id: payload.data.id,
				createdAt: new Date(payload.data.createdAt),
				modifiedAt: safeParseDate(payload.data.modifiedAt),
				amount: payload.data.amount,
				currency: payload.data.currency,
				recurringInterval: payload.data.recurringInterval,
				status: payload.data.status,
				currentPeriodStart:
					safeParseDate(payload.data.currentPeriodStart) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.currentPeriodEnd) || new Date(),
				cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd || false,
				canceledAt: safeParseDate(payload.data.canceledAt),
				startedAt: safeParseDate(payload.data.startedAt) || new Date(),
				endsAt: safeParseDate(payload.data.endsAt),
				endedAt: safeParseDate(payload.data.endedAt),
				customerId: payload.data.customerId,
				productId: payload.data.productId,
				discountId: payload.data.discountId || null,
				checkoutId: payload.data.checkoutId || "",
				customerCancellationReason:
					payload.data.customerCancellationReason || null,
				customerCancellationComment:
					payload.data.customerCancellationComment || null,
				metadata: payload.data.metadata
					? JSON.stringify(payload.data.metadata)
					: null,
				customFieldData: payload.data.customFieldData
					? JSON.stringify(payload.data.customFieldData)
					: null,
				// Set plan features based on product
				maxUsers: plan.maxUsers,
				maxNotes: plan.maxNotes,
				organizationId: organizationId,
			},
		});

		console.log("✅ Created subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error creating subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

export async function handleSubscriptionUpdated(payload: any) {
	console.log("🎯 Processing subscription.updated:", payload.data.id);

	// Get the plan details
	const plan = getPlanByProductId(payload.data.product?.id || "");
	if (!plan) {
		console.error("❌ Invalid plan iD: ", payload.data.product?.name);
		return;
	}

	try {
		// Check if subscription exists
		const existingSubscription = await prisma.subscription.findUnique({
			where: { id: payload.data.id },
		});

		if (!existingSubscription) {
			console.log("⚠️ Subscription not found, creating new one");
			return await handleSubscriptionCreated(payload);
		}

		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt:
					safeParseDate(payload.data.modifiedAt) || new Date(),
				amount: payload.data.amount,
				currency: payload.data.currency,
				recurringInterval: payload.data.recurringInterval,
				status: payload.data.status,
				currentPeriodStart:
					safeParseDate(payload.data.currentPeriodStart) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.currentPeriodEnd) || new Date(),
				cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd || false,
				canceledAt: safeParseDate(payload.data.canceledAt),
				startedAt: safeParseDate(payload.data.startedAt) || new Date(),
				endsAt: safeParseDate(payload.data.endsAt),
				endedAt: safeParseDate(payload.data.endedAt),
				customerId: payload.data.customerId,
				productId: payload.data.productId,
				discountId: payload.data.discountId || null,
				checkoutId: payload.data.checkoutId || "",
				customerCancellationReason:
					payload.data.customerCancellationReason || null,
				customerCancellationComment:
					payload.data.customerCancellationComment || null,
				metadata: payload.data.metadata
					? JSON.stringify(payload.data.metadata)
					: null,
				customFieldData: payload.data.customFieldData
					? JSON.stringify(payload.data.customFieldData)
					: null,
				// Note: Don't update organizationId on updates to prevent accidental changes
			},
		});

		console.log("✅ Updated subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error updating subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

export async function handleSubscriptionCanceled(payload: any) {
	console.log("🎯 Processing subscription.canceled:", payload.data.id);

	try {
		// Check if subscription exists
		const existingSubscription = await prisma.subscription.findUnique({
			where: { id: payload.data.id },
		});

		if (!existingSubscription) {
			console.log("⚠️ Subscription not found for cancellation");
			return;
		}

		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "canceled",
				cancelAtPeriodEnd: true,
				canceledAt:
					safeParseDate(payload.data.canceledAt) || new Date(),
				customerCancellationReason:
					payload.data.customerCancellationReason || null,
				customerCancellationComment:
					payload.data.customerCancellationComment || null,
				// Update other fields that might have changed
				currentPeriodEnd:
					safeParseDate(payload.data.currentPeriodEnd) || new Date(),
				endsAt: safeParseDate(payload.data.endsAt),
				endedAt: safeParseDate(payload.data.endedAt),
			},
		});

		console.log("✅ Canceled subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error canceling subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

export async function handleSubscriptionRevoked(payload: any) {
	console.log("🎯 Processing subscription.revoked:", payload.data.id);

	try {
		// Check if subscription exists
		const existingSubscription = await prisma.subscription.findUnique({
			where: { id: payload.data.id },
		});

		if (!existingSubscription) {
			console.log("⚠️ Subscription not found for revocation");
			return;
		}

		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "revoked",
				cancelAtPeriodEnd: true,
				canceledAt:
					safeParseDate(payload.data.canceledAt) || new Date(),
				endedAt: new Date(),
				customerCancellationReason:
					payload.data.customerCancellationReason || "revoked",
			},
		});

		console.log("✅ Revoked subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error revoking subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

export async function handleSubscriptionUncanceled(payload: any) {
	console.log("🎯 Processing subscription.uncanceled:", payload.data.id);

	try {
		// Check if subscription exists
		const existingSubscription = await prisma.subscription.findUnique({
			where: { id: payload.data.id },
		});

		if (!existingSubscription) {
			console.log("⚠️ Subscription not found for uncancellation");
			return;
		}

		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: payload.data.status,
				cancelAtPeriodEnd: false,
				canceledAt: null,
				endedAt: null,
				customerCancellationReason: null,
				customerCancellationComment: null,
				// Update period information
				currentPeriodStart:
					safeParseDate(payload.data.currentPeriodStart) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.currentPeriodEnd) || new Date(),
			},
		});

		console.log("✅ Uncanceled subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error uncanceling subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

export async function handleSubscriptionActive(payload: any) {
	console.log("🎯 Processing subscription.active:", payload.data.id);

	// Get the plan details for the activated subscription
	const plan = getPlan(payload.data.product?.name?.toLowerCase() || "");
	if (!plan) {
		console.error("❌ Invalid plan name:", payload.data.product?.name);
		return;
	}

	try {
		// Check if subscription exists
		const existingSubscription = await prisma.subscription.findUnique({
			where: { id: payload.data.id },
		});

		if (!existingSubscription) {
			console.log("⚠️ Subscription not found, creating new one");
			return await handleSubscriptionCreated(payload);
		}

		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "active",
				currentPeriodStart:
					safeParseDate(payload.data.currentPeriodStart) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.currentPeriodEnd) || new Date(),
				startedAt: safeParseDate(payload.data.startedAt) || new Date(),
			},
		});

		console.log("✅ Activated subscription:", payload.data.id);
	} catch (error) {
		console.error("💥 Error activating subscription:", error);
		// Don't throw - let webhook succeed to avoid retries
	}
}

// Main webhook handler
export async function handleSubscriptionWebhook(payload: any) {
	const { type } = payload;

	switch (type) {
		case "subscription.created":
			return handleSubscriptionCreated(payload);

		case "subscription.updated":
			return handleSubscriptionUpdated(payload);

		case "subscription.canceled":
			return handleSubscriptionCanceled(payload);

		case "subscription.revoked":
			return handleSubscriptionRevoked(payload);

		case "subscription.uncanceled":
			return handleSubscriptionUncanceled(payload);

		case "subscription.active":
			return handleSubscriptionActive(payload);

		default:
			console.log(`🤷‍♂️ Unhandled subscription event: ${type}`);
	}
}
