import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { customSession, organization } from "better-auth/plugins";
import { admin, member } from "./auth/permissions";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import {
	createOrganization,
	getActiveOrganization,
} from "@/server/organizations";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import {
	handleSubscriptionCanceled,
	handleSubscriptionCreated,
	handleSubscriptionUpdated,
} from "@/server/polar";
import { SUBSCRIPTION_PLANS } from "./utils";
import { createFreeSubscription } from "@/server/subscription";

const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	// Use 'sandbox' for development, 'production' for live
	server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const auth = betterAuth({
	appName: "Multi-tenant SaaS Boilerplate",
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// Create a personal organization for the user
					const { data, success } = await createOrganization(
						user.id,
						{
							name: "Personal",
							slug: "personal",
						}
					);

					if (success && data) {
						await createFreeSubscription(data.id);
					}
				},
			},
		},
		session: {
			create: {
				before: async (session) => {
					const organization = await getActiveOrganization(
						session.userId
					);
					return {
						data: {
							...session,
							activeOrganizationId: organization?.id,
						},
					};
				},
			},
		},
	},
	plugins: [
		organization({
			creatorRole: "admin",
			async sendInvitationEmail(data) {
				const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;

				console.log("Invite link:", inviteLink);
			},
			roles: {
				admin,
				member,
			},
			schema: {
				organization: {
					additionalFields: {
						maxUsers: {
							type: "number",
							input: true,
							required: false,
							defaultValue: 3,
						},
						maxNotes: {
							type: "number",
							input: true,
							required: false,
							defaultValue: 50,
						},
						subscription: {
							type: "string",
							input: true,
							required: false,
							defaultValue: "free",
						},
					},
				},
			},
		}),
		nextCookies(),
		customSession(async ({ user, session }) => {
			const organization = await getActiveOrganization(session.userId);
			return {
				user: {
					...user,
					role: organization?.role,
				},
				session,
				activeOrganizationId: organization?.id,
				subscription: organization?.subscription,
			};
		}),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: SUBSCRIPTION_PLANS.map((plan) => ({
						productId: plan.productId,
						slug: plan.id,
					})),
					successUrl: "/dashboard/subscription/success",
					authenticatedUsersOnly: true,
				}),
				portal(),
				webhooks({
					secret: process.env.POLAR_WEBHOOK_SECRET!,
					onSubscriptionCreated: handleSubscriptionCreated,
					onSubscriptionUpdated: handleSubscriptionUpdated,
					onSubscriptionCanceled: handleSubscriptionCanceled,
				}),
			],
		}),
	],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session;
