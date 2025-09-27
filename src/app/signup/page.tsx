"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/server/users";
import { authClient } from "@/lib/auth-client";
import { SignupForm } from "@/components/forms/signup-form";
import { AuthWrapper } from "@/components/auth-wrapper";

const Signup = () => {
	const { user } = authClient.useSession().data || {};
	const router = useRouter();

	if (!!user) {
		router.push("/dashboard");
	}

	const handleSubmit = async (formData: FormData) => {
		try {
			toast.loading("Creating your account...");
			const { success, message } = await signUp({
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				username: formData.get("name") as string,
			});

			if (success) {
				toast.dismiss();
				toast.success(`${message as string}`);
				router.push("/dashboard");
			} else {
				toast.error(message as string);
			}
		} catch (error) {
			console.log("Error signing up:", error);
			toast.dismiss();
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<AuthWrapper>
			<SignupForm action={handleSubmit} />
		</AuthWrapper>
	);
};

export default Signup;
