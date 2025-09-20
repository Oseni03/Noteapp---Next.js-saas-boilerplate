import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/server/permissions";

// Remove member
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string; memberIdOrEmail: string }> }
) {
	try {
		const { slug, memberIdOrEmail } = await params;

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

		const data = await auth.api.removeMember({
			body: {
				memberIdOrEmail,
				organizationId: tenant.id,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Member removed successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to remove member" },
				data: null,
			},
			{ status: 500 }
		);
	}
}

// Update member role
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string; memberIdOrEmail: string }> }
) {
	try {
		const { slug, memberIdOrEmail } = await params;
		const { role } = await request.json();

		if (!role) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Role is required" },
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

		await auth.api.updateMemberRole({
			body: {
				role,
				memberId: memberIdOrEmail,
				organizationId: tenant.id,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Member role updated successfully",
			data: null,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to update member role" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
