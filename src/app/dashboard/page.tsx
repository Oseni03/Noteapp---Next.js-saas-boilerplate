"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit, Trash2, Tag, Calendar, User } from "lucide-react";
import { Note } from "@/types";
import { format } from "date-fns";

const Page = () => {
	const {
		notes,
		currentTenant,
		currentUser,
		users,
		addNote,
		updateNote,
		deleteNote,
	} = useAppContext();
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingNote, setEditingNote] = useState<Note | null>(null);
	const [newNote, setNewNote] = useState({
		title: "",
		content: "",
		tags: "",
		isPublic: true,
	});

	const tenantNotes = useMemo(() => {
		return notes.filter((note) => note.tenantId === currentTenant?.id);
	}, [notes, currentTenant?.id]);

	const filteredNotes = useMemo(() => {
		return tenantNotes.filter(
			(note) =>
				note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				note.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				)
		);
	}, [tenantNotes, searchTerm]);

	const handleCreateNote = () => {
		if (!currentUser || !currentTenant) return;

		addNote({
			title: newNote.title || "Untitled Note",
			content: newNote.content,
			authorId: currentUser.id,
			tenantId: currentTenant.id,
			tags: newNote.tags
				? newNote.tags.split(",").map((tag) => tag.trim())
				: [],
			isPublic: newNote.isPublic,
		});

		setNewNote({ title: "", content: "", tags: "", isPublic: true });
		setIsCreateModalOpen(false);
	};

	const handleEditNote = (note: Note) => {
		setEditingNote(note);
		setNewNote({
			title: note.title,
			content: note.content,
			tags: note.tags.join(", "),
			isPublic: note.isPublic,
		});
	};

	const handleUpdateNote = () => {
		if (!editingNote) return;

		updateNote(editingNote.id, {
			title: newNote.title || "Untitled Note",
			content: newNote.content,
			tags: newNote.tags
				? newNote.tags.split(",").map((tag) => tag.trim())
				: [],
			isPublic: newNote.isPublic,
		});

		setEditingNote(null);
		setNewNote({ title: "", content: "", tags: "", isPublic: true });
	};

	const getAuthorName = (authorId: string) => {
		return users.find((user) => user.id === authorId)?.name || "Unknown";
	};

	const canEditNote = (note: Note) => {
		return (
			currentUser?.role === "admin" || note.authorId === currentUser?.id
		);
	};

	const hasReachedLimit = () => {
		return tenantNotes.length >= (currentTenant?.maxNotes || 0);
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-foreground">
						Notes
					</h1>
					<p className="text-muted-foreground">
						{tenantNotes.length} of {currentTenant?.maxNotes} notes
						used
					</p>
				</div>
				<Button
					onClick={() => setIsCreateModalOpen(true)}
					disabled={hasReachedLimit()}
					className="gap-2"
				>
					<Plus className="w-4 h-4" />
					New Note
				</Button>
			</div>

			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
				<Input
					placeholder="Search notes..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Notes Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredNotes.map((note) => (
					<Card
						key={note.id}
						className="hover:shadow-md transition-shadow"
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<h3 className="font-medium text-lg line-clamp-2">
									{note.title}
								</h3>
								{canEditNote(note) && (
									<div className="flex gap-1 ml-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleEditNote(note)}
											className="h-8 w-8 p-0"
										>
											<Edit className="w-3 h-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => deleteNote(note.id)}
											className="h-8 w-8 p-0 text-destructive hover:text-destructive"
										>
											<Trash2 className="w-3 h-3" />
										</Button>
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground line-clamp-3 text-sm">
								{note.content}
							</p>

							{note.tags.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{note.tags.slice(0, 3).map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="text-xs"
										>
											<Tag className="w-2 h-2 mr-1" />
											{tag}
										</Badge>
									))}
									{note.tags.length > 3 && (
										<Badge
											variant="secondary"
											className="text-xs"
										>
											+{note.tags.length - 3}
										</Badge>
									)}
								</div>
							)}

							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<div className="flex items-center gap-1">
									<User className="w-3 h-3" />
									{getAuthorName(note.authorId)}
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="w-3 h-3" />
									{format(note.updatedAt, "MMM d")}
								</div>
							</div>

							{!note.isPublic && (
								<Badge variant="outline" className="text-xs">
									Private
								</Badge>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{filteredNotes.length === 0 && (
				<div className="text-center py-12">
					<p className="text-muted-foreground">
						{searchTerm
							? "No notes found matching your search."
							: "No notes yet. Create your first note!"}
					</p>
				</div>
			)}

			{/* Create/Edit Modal */}
			<Dialog
				open={isCreateModalOpen || !!editingNote}
				onOpenChange={(open) => {
					if (!open) {
						setIsCreateModalOpen(false);
						setEditingNote(null);
						setNewNote({
							title: "",
							content: "",
							tags: "",
							isPublic: true,
						});
					}
				}}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{editingNote ? "Edit Note" : "Create New Note"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={newNote.title}
								onChange={(e) =>
									setNewNote({
										...newNote,
										title: e.target.value,
									})
								}
								placeholder="Enter note title..."
							/>
						</div>
						<div>
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								value={newNote.content}
								onChange={(e) =>
									setNewNote({
										...newNote,
										content: e.target.value,
									})
								}
								placeholder="Write your note content..."
								rows={6}
							/>
						</div>
						<div>
							<Label htmlFor="tags">Tags (comma-separated)</Label>
							<Input
								id="tags"
								value={newNote.tags}
								onChange={(e) =>
									setNewNote({
										...newNote,
										tags: e.target.value,
									})
								}
								placeholder="tag1, tag2, tag3"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="public"
								checked={newNote.isPublic}
								onCheckedChange={(checked) =>
									setNewNote({
										...newNote,
										isPublic: checked,
									})
								}
							/>
							<Label htmlFor="public">
								Make this note public
							</Label>
						</div>
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => {
									setIsCreateModalOpen(false);
									setEditingNote(null);
									setNewNote({
										title: "",
										content: "",
										tags: "",
										isPublic: true,
									});
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={
									editingNote
										? handleUpdateNote
										: handleCreateNote
								}
							>
								{editingNote ? "Update" : "Create"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Page;
