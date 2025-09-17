import { User, Tenant, Note } from "@/types";

export const mockTenants: Tenant[] = [
	{
		id: "tenant-1",
		name: "Acme Corporation",
		domain: "acme.com",
		subscription: "enterprise",
		maxUsers: 100,
		maxNotes: 1000,
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "tenant-2",
		name: "TechStart Inc",
		domain: "techstart.io",
		subscription: "pro",
		maxUsers: 25,
		maxNotes: 500,
		createdAt: new Date("2024-02-15"),
	},
	{
		id: "tenant-3",
		name: "Local Business",
		domain: "localbiz.com",
		subscription: "free",
		maxUsers: 5,
		maxNotes: 50,
		createdAt: new Date("2024-03-01"),
	},
];

export const mockUsers: User[] = [
	{
		id: "user-1",
		name: "John Admin",
		email: "john@acme.com",
		role: "admin",
		tenantId: "tenant-1",
		createdAt: new Date("2024-01-01"),
	},
	{
		id: "user-2",
		name: "Sarah Johnson",
		email: "sarah@acme.com",
		role: "user",
		tenantId: "tenant-1",
		createdAt: new Date("2024-01-05"),
	},
	{
		id: "user-3",
		name: "Mike Chen",
		email: "mike@techstart.io",
		role: "admin",
		tenantId: "tenant-2",
		createdAt: new Date("2024-02-15"),
	},
	{
		id: "user-4",
		name: "Lisa Brown",
		email: "lisa@localbiz.com",
		role: "admin",
		tenantId: "tenant-3",
		createdAt: new Date("2024-03-01"),
	},
];

export const mockNotes: Note[] = [
	{
		id: "note-1",
		title: "Q1 Planning Meeting Notes",
		content:
			"Discussed quarterly goals and resource allocation. Key decisions made on product roadmap.",
		authorId: "user-1",
		tenantId: "tenant-1",
		tags: ["planning", "q1", "strategy"],
		isPublic: true,
		createdAt: new Date("2024-01-10"),
		updatedAt: new Date("2024-01-10"),
	},
	{
		id: "note-2",
		title: "Technical Architecture Review",
		content:
			"Review of current system architecture and proposed improvements for scalability.",
		authorId: "user-2",
		tenantId: "tenant-1",
		tags: ["tech", "architecture", "review"],
		isPublic: false,
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-16"),
	},
	{
		id: "note-3",
		title: "Startup Funding Strategy",
		content:
			"Notes on Series A preparation and potential investor outreach strategies.",
		authorId: "user-3",
		tenantId: "tenant-2",
		tags: ["funding", "strategy", "investors"],
		isPublic: true,
		createdAt: new Date("2024-02-20"),
		updatedAt: new Date("2024-02-20"),
	},
	{
		id: "note-4",
		title: "Local Marketing Ideas",
		content:
			"Brainstorming session for local community engagement and marketing initiatives.",
		authorId: "user-4",
		tenantId: "tenant-3",
		tags: ["marketing", "local", "community"],
		isPublic: true,
		createdAt: new Date("2024-03-05"),
		updatedAt: new Date("2024-03-05"),
	},
];
