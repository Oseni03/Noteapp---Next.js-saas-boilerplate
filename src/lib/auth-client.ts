import {
	customSessionClient,
	organizationClient,
	inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		organizationClient({
			schema: inferOrgAdditionalFields({
				organization: {
					additionalFields: {
						maxUsers: {
							type: "number",
						},
						maxNotes: {
							type: "number",
						},
						subscription: {
							type: "string",
						},
					},
				},
			}),
			// schema: inferOrgAdditionalFields<typeof auth>(),
		}),
		customSessionClient<typeof auth>(),
		polarClient(),
	],
});
