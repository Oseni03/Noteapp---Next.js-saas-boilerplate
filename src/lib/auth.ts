import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { customSession, organization } from "better-auth/plugins";
import { admin, member } from "./auth/permissions";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { getActiveOrganization } from "@/server/organizations";

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
				subscription: organization?.subscription || "free",
			};
		}),
	],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
