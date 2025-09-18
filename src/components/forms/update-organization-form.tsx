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
	name: z.string().min(2).max(50),
	slug: z.string().min(2).max(50),
});

export function UpdateOrganizationForm({
	organization,
}: {
	organization: Organization;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: organization.name,
			slug: organization.slug,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			toast.loading("Updating organization...");
			setIsLoading(true);

			const response = await fetch(
				`/api/organizations/${organization.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data: { name: values.name, slug: values.slug },
					}),
				}
			);

			const result = await response.json();

			if (result.success) {
				toast.dismiss();
				toast.success(result.message);
			} else {
				console.error("Error:", result.message);
				toast.dismiss();
				toast.error(result.message);
			}
		} catch (error) {
			console.error(error);
			toast.dismiss();
			toast.error("Failed to update organization");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="My Organization"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input placeholder="my-org" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button disabled={isLoading} type="submit">
					Update Organization
					{isLoading && <Loader2 className="size-4 animate-spin" />}
				</Button>
			</form>
		</Form>
	);
}
