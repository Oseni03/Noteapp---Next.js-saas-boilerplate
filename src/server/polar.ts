/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

// Helper function for safe date parsing
function safeParseDate(dateString: string | null | undefined): Date | null {
	if (!dateString) return null;
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}

export async function handleSubscriptionCreated(payload: any) {
	console.log("🎯 Processing subscription.created:", payload.data.id);

	// Extract organization ID from customer data
	const organizationId = payload.data.customer?.external_id;
	if (!organizationId) {
		console.error("❌ No organizationId found in customer.external_id");
		return;
	}

	try {
		await prisma.subscription.create({
			data: {
				id: payload.data.id,
				createdAt: new Date(payload.data.created_at),
				modifiedAt: safeParseDate(payload.data.modified_at),
				amount: payload.data.amount,
				currency: payload.data.currency,
				recurringInterval: payload.data.recurring_interval,
				status: payload.data.status,
				currentPeriodStart:
					safeParseDate(payload.data.current_period_start) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.current_period_end) ||
					new Date(),
				cancelAtPeriodEnd: payload.data.cancel_at_period_end || false,
				canceledAt: safeParseDate(payload.data.canceled_at),
				startedAt: safeParseDate(payload.data.started_at) || new Date(),
				endsAt: safeParseDate(payload.data.ends_at),
				endedAt: safeParseDate(payload.data.ended_at),
				customerId: payload.data.customer_id,
				productId: payload.data.product_id,
				discountId: payload.data.discount_id || null,
				checkoutId: payload.data.checkout_id || "",
				customerCancellationReason:
					payload.data.customer_cancellation_reason || null,
				customerCancellationComment:
					payload.data.customer_cancellation_comment || null,
				metadata: payload.data.metadata
					? JSON.stringify(payload.data.metadata)
					: null,
				customFieldData: payload.data.custom_field_data
					? JSON.stringify(payload.data.custom_field_data)
					: null,
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

	try {
		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt:
					safeParseDate(payload.data.modified_at) || new Date(),
				amount: payload.data.amount,
				currency: payload.data.currency,
				recurringInterval: payload.data.recurring_interval,
				status: payload.data.status,
				currentPeriodStart:
					safeParseDate(payload.data.current_period_start) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.current_period_end) ||
					new Date(),
				cancelAtPeriodEnd: payload.data.cancel_at_period_end || false,
				canceledAt: safeParseDate(payload.data.canceled_at),
				startedAt: safeParseDate(payload.data.started_at) || new Date(),
				endsAt: safeParseDate(payload.data.ends_at),
				endedAt: safeParseDate(payload.data.ended_at),
				customerId: payload.data.customer_id,
				productId: payload.data.product_id,
				discountId: payload.data.discount_id || null,
				checkoutId: payload.data.checkout_id || "",
				customerCancellationReason:
					payload.data.customer_cancellation_reason || null,
				customerCancellationComment:
					payload.data.customer_cancellation_comment || null,
				metadata: payload.data.metadata
					? JSON.stringify(payload.data.metadata)
					: null,
				customFieldData: payload.data.custom_field_data
					? JSON.stringify(payload.data.custom_field_data)
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
		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "canceled",
				cancelAtPeriodEnd: true,
				canceledAt:
					safeParseDate(payload.data.canceled_at) || new Date(),
				customerCancellationReason:
					payload.data.customer_cancellation_reason || null,
				customerCancellationComment:
					payload.data.customer_cancellation_comment || null,
				// Update other fields that might have changed
				currentPeriodEnd:
					safeParseDate(payload.data.current_period_end) ||
					new Date(),
				endsAt: safeParseDate(payload.data.ends_at),
				endedAt: safeParseDate(payload.data.ended_at),
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
		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "revoked",
				cancelAtPeriodEnd: true,
				canceledAt:
					safeParseDate(payload.data.canceled_at) || new Date(),
				endedAt: new Date(),
				customerCancellationReason:
					payload.data.customer_cancellation_reason || "revoked",
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
					safeParseDate(payload.data.current_period_start) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.current_period_end) ||
					new Date(),
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

	try {
		await prisma.subscription.update({
			where: { id: payload.data.id },
			data: {
				modifiedAt: new Date(),
				status: "active",
				currentPeriodStart:
					safeParseDate(payload.data.current_period_start) ||
					new Date(),
				currentPeriodEnd:
					safeParseDate(payload.data.current_period_end) ||
					new Date(),
				startedAt: safeParseDate(payload.data.started_at) || new Date(),
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
