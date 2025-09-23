"use client";

import React, { useState } from "react";
import { Users, UserPlus, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/use-auth";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useOrganizationStore } from "@/zustand/providers/organization-store-provider";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { InvitationForm } from "../forms/invitation-form";
import { UpdateMemberRoleForm } from "../forms/update-member-role-form";
import { toast } from "sonner";
import { removeMember } from "@/server/members";
import { Member } from "@/types";

export const MembersCard = () => {
	const {
		activeOrganization,
		members,
		removeMember: removeMemberFromStore,
	} = useOrganizationStore((state) => state);
	const { isAdmin } = useAuthState();
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [isInviteOpen, setIsInviteOpen] = useState(false);
	const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleRemoveMember = async (memberId: string) => {
		setIsLoading(true);
		try {
			await removeMember(activeOrganization!.id, memberId);
			removeMemberFromStore(memberId);
			toast.success("Member removed successfully");
		} catch (error) {
			console.log("Error removing member: ", error);
			toast.error("Failed to remove member");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Organization Members
					</CardTitle>
					{isAdmin && (
						<Dialog
							open={isInviteOpen}
							onOpenChange={setIsInviteOpen}
						>
							<DialogTrigger asChild>
								<Button>
									<UserPlus className="h-4 w-4 mr-2" />
									Invite Member
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Invite New Member</DialogTitle>
								</DialogHeader>
								<InvitationForm
									onSuccess={() => setIsInviteOpen(false)}
								/>
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members?.map((member) => (
							<TableRow key={member.id}>
								<TableCell>{member.user.name}</TableCell>
								<TableCell>{member.user.email}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										{member.role === "admin" && (
											<Shield className="h-4 w-4" />
										)}
										{member.role.charAt(0).toUpperCase() +
											member.role.slice(1)}
									</div>
								</TableCell>
								<TableCell className="text-right">
									{isAdmin && (
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelectedMember(member);
													setIsUpdateRoleOpen(true);
												}}
											>
												Change Role
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() =>
													handleRemoveMember(
														member.id
													)
												}
												disabled={
													isLoading ||
													member.role === "admin"
												}
												title={
													member.role === "admin"
														? "Admin members cannot be removed"
														: ""
												}
											>
												Remove
											</Button>
										</div>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>

			{/* Update Role Dialog */}
			<Dialog open={isUpdateRoleOpen} onOpenChange={setIsUpdateRoleOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Member Role</DialogTitle>
					</DialogHeader>
					{selectedMember && (
						<UpdateMemberRoleForm
							memberId={selectedMember.id}
							defaultValues={{
								email: selectedMember.user.email,
								role: selectedMember.role as "admin" | "member",
							}}
							onSuccess={() => setIsUpdateRoleOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</Card>
	);
};
