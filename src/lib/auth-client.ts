import {
	customSessionClient,
	organizationClient,
	inferOrgAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [
		organizationClient({
			schema: inferOrgAdditionalFields<typeof auth>(),
		}),
		customSessionClient<typeof auth>(),
	],
});
