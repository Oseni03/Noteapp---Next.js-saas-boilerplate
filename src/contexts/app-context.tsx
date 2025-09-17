"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppContextType, User, Tenant, Note } from "@/types";
import { mockTenants, mockUsers, mockNotes } from "@/data/mock-data";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within an AppProvider");
	}
	return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
	const [users] = useState<User[]>(mockUsers);
	const [tenants] = useState<Tenant[]>(mockTenants);
	const [notes, setNotes] = useState<Note[]>(mockNotes);

	// Initialize with first user and their tenant
	useEffect(() => {
		const firstUser = mockUsers[0];
		const firstTenant = mockTenants.find(
			(t) => t.id === firstUser.tenantId
		);
		setCurrentUser(firstUser);
		setCurrentTenant(firstTenant || null);
	}, []);

	const switchTenant = (tenantId: string) => {
		const tenant = tenants.find((t) => t.id === tenantId);
		const user = users.find((u) => u.tenantId === tenantId);
		if (tenant && user) {
			setCurrentTenant(tenant);
			setCurrentUser(user);
		}
	};

	const addNote = (
		noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
	) => {
		const newNote: Note = {
			...noteData,
			id: `note-${Date.now()}`,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setNotes((prev) => [newNote, ...prev]);
	};

	const updateNote = (id: string, updates: Partial<Note>) => {
		setNotes((prev) =>
			prev.map((note) =>
				note.id === id
					? { ...note, ...updates, updatedAt: new Date() }
					: note
			)
		);
	};

	const deleteNote = (id: string) => {
		setNotes((prev) => prev.filter((note) => note.id !== id));
	};

	const value: AppContextType = {
		currentUser,
		currentTenant,
		users,
		tenants,
		notes,
		switchTenant,
		addNote,
		updateNote,
		deleteNote,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
