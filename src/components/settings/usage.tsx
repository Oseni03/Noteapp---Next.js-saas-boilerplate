"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Progress } from "../ui/progress";
import { Note } from "@prisma/client";
import { useAuthState } from "@/hooks/use-auth";

export const UsageCard = () => {
	const { activeOrganization, memberCount } = useAuthState();
	const [notes, setNotes] = useState<Note[]>([]);
	const maxNotes = activeOrganization?.maxNotes
		? activeOrganization?.maxNotes == 1
			? 1000000000
			: activeOrganization?.maxNotes
		: 50;
	const maxUsers = activeOrganization?.maxUsers
		? activeOrganization?.maxUsers == 1
			? 1000000000
			: activeOrganization?.maxUsers
		: 50;

	useEffect(() => {
		const getNotes = async () => {
			try {
				const resp = await fetch("/api/notes");
				if (!resp.ok) {
					throw new Error("Error getting notes");
				}
				const { notes } = await resp.json();
				setNotes(notes);
			} catch (error: unknown) {
				console.log("Error getting notes", error);
			}
		};

		getNotes();
	}, []);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="w-5 h-5" />
					Usage & Limits
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Users</span>
						<span className="font-medium">
							{memberCount} / {maxUsers}
						</span>
					</div>
					<Progress
						value={((memberCount || 0) / maxUsers) * 100}
						className="h-2"
					/>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Notes</span>
						<span className="font-medium">
							{notes.length} / {maxNotes}
						</span>
					</div>
					<Progress
						value={(notes.length / maxNotes) * 100}
						className="h-2"
					/>
				</div>
			</CardContent>
		</Card>
	);
};
