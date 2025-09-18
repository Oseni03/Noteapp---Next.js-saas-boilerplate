export interface User {
	role: string | undefined;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	emailVerified: boolean;
	name: string;
	image?: string | null | undefined;
}
export interface Organization {
	id: string;
	name: string;
	slug: string;
	subscription?: "free" | "pro" | "enterprise";
	maxUsers?: number;
	maxNotes?: number;
	createdAt: Date;
	logo?: string | null;
	// metadata?: any;
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
