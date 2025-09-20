"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Calendar, Shield, Users } from "lucide-react";
import { format } from "date-fns";
import {
	Dialog,
	DialogDescription,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { InvitationForm } from "@/components/forms/invitation-form";
import { useAuthState } from "@/hooks/use-auth";
import { UpdateMemberRoleForm } from "@/components/forms/update-member-role-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Page = () => {
	const { activeOrganization, members, user, isAdmin } = useAuthState();

	if (!isAdmin) {
		return (
			<div className="p-6">
				<div className="text-center py-12">
					<Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						Access Restricted
					</h2>
					<p className="text-muted-foreground">
						You need admin privileges to view user management.
					</p>
				</div>
			</div>
		);
	}

	async function handleRemoveMember(memberId: string) {
		try {
			toast.loading("Removing member...");

			const response = await fetch(
				`/api/tenants/${activeOrganization.slug}/members/${memberId}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				}
			);

			const result = await response.json();

			if (result.success) {
				toast.dismiss();
				toast.success(`${result.message as string}.`);
			} else {
				console.error("Error:", result.message);
				toast.dismiss();
				toast.error(result.error.message || "Failed to remove member");
			}
		} catch (error) {
			console.error(error);
			toast.dismiss();
			toast.error("Failed to remove member");
		}
	}

	const availableSlots =
		activeOrganization.maxUsers === 1
			? "Unlimited slots available"
			: `${
					activeOrganization.maxUsers! - (members?.length || 0)
			  } slots available`;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<Dialog>
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							User Management
						</h1>
						<p className="text-muted-foreground">
							{members?.length || 0} of{" "}
							{activeOrganization.maxUsers} users
						</p>
					</div>
					<DialogTrigger asChild>
						<Button disabled={!isAdmin}>
							<Users className="w-4 h-4 mr-2" />
							Invite User
						</Button>
					</DialogTrigger>
				</div>
				{/* Create Dialog Content */}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite User</DialogTitle>
						<DialogDescription>
							Invite a new user to your tenant.
						</DialogDescription>
					</DialogHeader>
					<InvitationForm organization={activeOrganization} />
				</DialogContent>
			</Dialog>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{members?.length}
						</div>
						<div className="text-xs text-muted-foreground">
							{availableSlots}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Admins
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{members?.filter((u) => u.role === "admin").length}
						</div>
						<div className="text-xs text-muted-foreground">
							Admin users
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Regular Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{members?.filter((u) => u.role === "user").length}
						</div>
						<div className="text-xs text-muted-foreground">
							Standard users
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users List */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Team Members</h2>
				<div className="grid gap-4">
					{members?.map((member) => (
						<Card key={member.id}>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<Avatar className="h-12 w-12">
											<AvatarFallback className="bg-primary text-primary-foreground font-medium">
												{member.user.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex items-center gap-2">
												<h3 className="font-medium">
													{member.user.name}
												</h3>
												<Badge
													variant={
														member.role === "admin"
															? "default"
															: "secondary"
													}
												>
													{member.role}
												</Badge>
												{member.userId === user?.id && (
													<Badge
														variant="outline"
														className="text-xs"
													>
														You
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
												<div className="flex items-center gap-1">
													<Mail className="w-3 h-3" />
													{member.user.email}
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													Joined{" "}
													{format(
														member.createdAt,
														"MMM yyyy"
													)}
												</div>
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													disabled={
														member.userId ===
															user?.id || !isAdmin
													}
												>
													Edit
												</Button>
											</DialogTrigger>
											{/* Update Dialog Content */}
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Update Member
													</DialogTitle>
													<DialogDescription>
														Update member role of
														your tenant.
													</DialogDescription>
												</DialogHeader>
												<UpdateMemberRoleForm
													organization={
														activeOrganization
													}
													defaultValues={{
														email: member.user
															.email,
														role: member.role as
															| "member"
															| "admin",
													}}
												/>
											</DialogContent>
										</Dialog>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													disabled={
														member.userId ===
														user?.id
													}
												>
													Remove
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you absolutely sure?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will
														permanently remove user
														from Tenant.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleRemoveMember(
																member.id
															)
														}
													>
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{members?.length === 0 && (
				<div className="text-center py-12">
					<Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">
						No users found for this tenant.
					</p>
				</div>
			)}
		</div>
	);
};

export default Page;
