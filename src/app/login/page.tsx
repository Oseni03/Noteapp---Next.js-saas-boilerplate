"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/server/users";
import { authClient } from "@/lib/auth-client";
import { LoginForm } from "@/components/forms/login-form";
import { AuthWrapper } from "@/components/auth-wrapper";

const Login = () => {
	const { user } = authClient.useSession().data || {};
	const router = useRouter();

	if (!!user) {
		router.push("/dashboard");
	}

	const handleSubmit = async (formData: FormData) => {
		try {
			toast.loading("Logging in...");
			const { success, message } = await signIn(
				formData.get("email") as string,
				formData.get("password") as string
			);

			if (success) {
				toast.dismiss();
				toast.success(message as string);
				router.push("/dashboard");
			} else {
				toast.dismiss();
				toast.error(message as string);
			}
		} catch (error) {
			console.log("Error logging in:", error);
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<AuthWrapper>
			<LoginForm action={handleSubmit} />
		</AuthWrapper>
	);
};

export default Login;
