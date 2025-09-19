"use client";

import React, { useState } from "react";
import { Building2, Edit, Loader2, Trash2 } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UpdateOrganizationForm } from "../forms/update-organization-form";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/use-auth";
import { Organization } from "@/types";
import { Card, CardContent } from "../ui/card";

const OrganizationCard = () => {
	const { activeOrganization, isLoading: orgLoading } = useAuthState();

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	if (orgLoading) {
		return (
			<Card>
				<CardContent>
					<div className="animate-pulse space-y-2">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const handleDeleteConfirm = async () => {
		try {
			toast.loading("Deleting organization...");
			setIsLoading(true);

			const response = await fetch(
				`/api/tenants/${activeOrganization?.slug}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
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
			toast.error("Failed to delete tenant");
		} finally {
			setIsLoading(false);
			setDeleteDialogOpen(false);
		}
		// You might redirect or show a success message here
	};

	return (
		<div className="space-y-6">
			{/* Organization Card */}
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Building2 className="w-6 h-6" />
							Tenant Information
						</h3>
						<div className="flex items-center gap-2">
							<Dialog
								open={updateDialogOpen}
								onOpenChange={setUpdateDialogOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											setUpdateDialogOpen(true)
										}
										className="h-9 w-9 p-0"
									>
										<Edit className="w-5 h-5" />
									</Button>
								</DialogTrigger>
							</Dialog>

							<AlertDialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 className="w-5 h-5" />
									</Button>
								</AlertDialogTrigger>
							</AlertDialog>
						</div>
					</div>
				</div>
				<div className="p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium text-gray-500">
								Name
							</label>
							<div className="text-lg font-medium">
								{activeOrganization?.name}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-500">
								Slug
							</label>
							<div className="text-lg font-medium">
								{activeOrganization?.slug}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-500">
								Created
							</label>
							<div className="text-lg font-medium">
								{activeOrganization &&
									format(
										activeOrganization.createdAt,
										"MMMM d, yyyy"
									)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Update Dialog */}
			<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
				<DialogContent showCloseButton={true}>
					<DialogHeader>
						<DialogTitle>Update Tenant</DialogTitle>
						<DialogDescription>
							Make changes to your tenant information here. Click
							save when you&rsquo;re done.
						</DialogDescription>
					</DialogHeader>
					<UpdateOrganizationForm
						organization={activeOrganization as Organization}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete the tenant{" "}
							<strong>{activeOrganization?.name}</strong> and
							remove all associated data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete Tenant
							{isLoading && (
								<Loader2 className="size-4 animate-spin" />
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default OrganizationCard;
