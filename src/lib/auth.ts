import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { admin, member, owner } from "./auth/permissions";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { getActiveOrganization } from "@/server/organizations";

export const auth = betterAuth({
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			console.log("Verification URL:", url);
		},
		sendOnSignUp: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			console.log("Reset password URL:", url);
		},
		requireEmailVerification: true,
	},
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
	database: prismaAdapter(prisma, {
		provider: "sqlite", // or "mysql", "postgresql", ...etc
	}),
	plugins: [
		organization({
			async sendInvitationEmail(data) {
				const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/accept-invitation/${data.id}`;

				console.log("Invite link:", inviteLink);
			},
			roles: {
				owner,
				admin,
				member,
			},
		}),
		nextCookies(),
	],
});
