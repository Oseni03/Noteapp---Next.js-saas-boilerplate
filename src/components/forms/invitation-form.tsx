"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Organization } from "@/types";

const formSchema = z.object({
	email: z.string().email(),
	role: z.enum(["admin", "member"]),
});

export function InvitationForm({
	organization,
}: {
	organization: Organization;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			role: "member",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			toast.loading("Sending invite...");
			setIsLoading(true);

			const response = await fetch(`/api/tenants/${organization.slug}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: values.email,
					role: values.role,
					resend: true,
				}),
			});

			const result = await response.json();

			if (result.success) {
				toast.dismiss();
				toast.success(`${result.message as string}. Check your email`);
			} else {
				console.error("Error:", result.message);
				toast.dismiss();
				toast.error(result.message);
			}
		} catch (error) {
			console.error(error);
			toast.dismiss();
			toast.error("Failed to create invitation");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="example@mail.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input placeholder="member" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} type="submit">
					Create Invite
					{isLoading && <Loader2 className="size-4 animate-spin" />}
				</Button>
			</form>
		</Form>
	);
}
