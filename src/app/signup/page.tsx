"use client";

import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/server/users";
import { authClient } from "@/lib/auth-client";
import { SignupForm } from "@/components/forms/signup-form";

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
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="#" className="flex items-center gap-2 font-medium">
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-4" />
						</div>
						Noteapp
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<SignupForm action={handleSubmit} />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<img
					src="/placeholder.svg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
};

export default Signup;
