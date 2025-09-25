export interface User {
	role?: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	emailVerified: boolean;
	name: string;
	image?: string | null | undefined;
}

export interface MemberUser {
	email: string;
	name: string;
	image?: string;
}

export interface Member {
	id: string;
	organizationId: string;
	userId: string;
	role: string;
	createdAt: Date;
	user: MemberUser;
}
export interface Organization {
	id: string;
	name: string;
	slug: string;
	subscription?: Subscription;
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
	tenantId: string;
	tags: string[];
	isPublic: boolean;
	createdAt: Date;
	updatedAt: Date;
	author: User;
}

export interface InvitationData {
	id: string;
	email: string;
	role: string;
	organizationId: string;
	teamId?: string;
	status: "pending" | "accepted" | "rejected" | "cancelled";
	createdAt: string;
	expiresAt: string;
}

export interface Subscription {
	id: string;
	organizationId: string;
	polarSubscriptionId: string;
	status: string;
	planName: string;
	amount: number;
	currency: string;
	currentPeriodEnd: string;
	cancelAtPeriodEnd: boolean;
	createdAt: string;
	updatedAt: string;
}
