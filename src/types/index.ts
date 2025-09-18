export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user";
	tenantId: string;
	avatar?: string;
	createdAt: Date;
}

export interface Tenant {
	id: string;
	name: string;
	domain: string;
	subscription: "free" | "pro" | "enterprise";
	maxUsers: number;
	maxNotes: number;
	createdAt: Date;
	logo?: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	authorId: string;
	organizationId: string;
	tags: string[];
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface AppContextType {
	currentUser: User | null;
	currentTenant: Tenant | null;
	users: User[];
	tenants: Tenant[];
	notes: Note[];
	switchTenant: (tenantId: string) => void;
	addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
	updateNote: (id: string, updates: Partial<Note>) => void;
	deleteNote: (id: string) => void;
}
