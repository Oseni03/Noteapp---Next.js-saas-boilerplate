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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { DialogFooter } from "../ui/dialog";

const formSchema = z.object({
	email: z.string().email(),
	role: z.enum(["admin", "member"]),
});

export function UpdateMemberRoleForm({
	organization,
	defaultValues,
}: {
	organization: Organization;
	defaultValues: z.infer<typeof formSchema>;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			toast.loading("Sending invite...");
			setIsLoading(true);

			const response = await fetch(
				`/api/tenants/${organization.slug}/members/${values.email}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						role: values.role,
					}),
				}
			);

			const result = await response.json();

			if (result.success) {
				toast.dismiss();
				toast.success(`${result.message as string}.`);
			} else {
				console.error("Error:", result.message);
				toast.dismiss();
				toast.error(
					result.error.message || "Failed to update member role"
				);
			}
		} catch (error) {
			console.error(error);
			toast.dismiss();
			toast.error("Failed to update member role");
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
									disabled
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
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a verified email to display" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="member">
										Member
									</SelectItem>
									<SelectItem value="admin">Admin</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogFooter>
					<Button disabled={isLoading} type="submit">
						Update Role
						{isLoading && (
							<Loader2 className="size-4 animate-spin" />
						)}
					</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
