import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/server/permissions";

// Create invitation
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const { email, role, teamId, resend } = await request.json();

		const { success } = await isAdmin();

		if (!success) {
			return NextResponse.json(
				{
					success: false,
					error: {
						message: "Unauthorized!. Only admin are allowed.",
					},
					data: null,
				},
				{ status: 401 }
			);
		}

		if (!email || !role) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Email and role are required" },
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

		const data = await auth.api.createInvitation({
			body: {
				email,
				role,
				organizationId: tenant.id,
				resend,
				...(teamId && { teamId }),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Invitation created successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to create invitation" },
				data: null,
			},
			{ status: 500 }
		);
	}
}

// List invitations
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		const tenant = await prisma.organization.findFirst({
			where: { slug },
			include: { members: true, invitations: true },
		});

		if (!tenant) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Tenant not found" },
					data: null,
				},
				{ status: 404 }
			);
		}

		const data = await auth.api.listInvitations({
			query: {
				organizationId: tenant.id,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Invitations retrieved successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to list invitations" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
