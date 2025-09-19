import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { getOrganizationById } from "@/server/organizations";

// GET /api/notes - List all notes for the authenticated user's organization
export async function GET(request: NextRequest) {
	return withAuth(request, async (request, currentUser) => {
		try {
			let notes;
			if (currentUser.role === "admin") {
				// Admin can view notes from any user in their organization
				notes = await prisma.note.findMany({
					where: {
						authorId: currentUser.id,
						organizationId: currentUser.organizationId,
					},
					include: {
						author: {
							select: {
								id: true,
								email: true,
								name: true,
							},
						},
					},
					orderBy: {
						updatedAt: "desc",
					},
				});
			} else {
				// Regular users can only view their own notes
				notes = await prisma.note.findMany({
					where: {
						authorId: currentUser.id,
						organizationId: currentUser.organizationId,
					},
					orderBy: {
						updatedAt: "desc",
					},
				});
			}

			return NextResponse.json({
				notes,
				total: notes.length,
			});
		} catch (error) {
			console.error("Get notes error:", error);
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	});
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
	return withAuth(request, async (request, currentUser) => {
		try {
			const { title, content, authorId, organizationId, tags, isPublic } =
				await request.json();

			if (!title || !content) {
				return NextResponse.json(
					{ error: "Title and content are required" },
					{ status: 400 }
				);
			}

			if (
				!authorId ||
				!organizationId ||
				currentUser.organizationId !== organizationId
			) {
				return NextResponse.json(
					{ error: "Not authorized" },
					{ status: 401 }
				);
			}

			const activeOrganization = await getOrganizationById(
				currentUser.organizationId
			);

			if (!activeOrganization) {
				return NextResponse.json(
					{ error: "Tenant not found" },
					{ status: 404 }
				);
			}

			if (activeOrganization?.subscription === "free") {
				const userNotesCount = await prisma.note.count({
					where: {
						authorId: currentUser.id,
						organizationId: currentUser.organizationId,
					},
				});

				if (userNotesCount >= 3) {
					return NextResponse.json(
						{
							error: "Free plan limited to 3 notes. Upgrade to Pro for unlimited notes.",
							message: "Upgrade to Pro",
						},
						{ status: 403 }
					);
				}
			}

			const newNote = await prisma.note.create({
				data: {
					title,
					content,
					tags,
					authorId: currentUser.id,
					organizationId: currentUser.organizationId,
					isPublic,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				include: {
					author: {
						select: {
							id: true,
							email: true,
							name: true,
						},
					},
				},
			});

			return NextResponse.json(
				{
					note: newNote,
					message: "Note created successfully",
				},
				{ status: 201 }
			);
		} catch (error) {
			console.error("Create note error:", error);
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	});
}

// Enable CORS for cross-origin requests
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}
