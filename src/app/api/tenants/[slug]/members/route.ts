import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// List members
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const { searchParams } = new URL(request.url);

		const limit = parseInt(searchParams.get("limit") || "100");
		const offset = parseInt(searchParams.get("offset") || "0");
		const sortBy = searchParams.get("sortBy") || "createdAt";
		const sortDirection = searchParams.get("sortDirection") as "desc" as
			| "desc"
			| "asc"
			| undefined;
		const filterField = searchParams.get("filterField");
		const filterOperator = searchParams.get("filterOperator") as
			| "eq"
			| "ne"
			| "lt"
			| "lte"
			| "gt"
			| "gte"
			| "contains"
			| undefined;
		const filterValue = searchParams.get("filterValue");

		const tenant = await prisma.organization.findFirst({
			where: { slug },
		});

		if (!tenant) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Organization not found" },
					data: null,
				},
				{ status: 404 }
			);
		}

		const data = await auth.api.listMembers({
			query: {
				organizationId: tenant.id,
				limit,
				offset,
				sortBy,
				sortDirection,
				...(filterField && { filterField }),
				...(filterOperator && { filterOperator }),
				...(filterValue && { filterValue }),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Members retrieved successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to list members" },
				data: null,
			},
			{ status: 500 }
		);
	}
}

// Add member
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const { userId, role, teamId } = await request.json();

		if (!userId || !role) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "User ID and role are required" },
					data: null,
				},
				{ status: 400 }
			);
		}

		const tenant = await prisma.organization.findFirst({
			where: { slug },
		});

		if (!tenant) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Organization not found" },
					data: null,
				},
				{ status: 404 }
			);
		}

		const data = await auth.api.addMember({
			body: {
				userId,
				role,
				organizationId: tenant.id,
				...(teamId && { teamId }),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Member added successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to add member" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
