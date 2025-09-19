import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/server/permissions";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		// Validate required params
		if (!slug) {
			return NextResponse.json(
				{
					success: false,
					message: "Tenant slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await prisma.organization.findFirst({
			where: { slug },
			include: { members: true, invitations: true },
		});

		return NextResponse.json({
			success: true,
			message: "Tenant retrieved successfully",
			data,
		});
	} catch (error) {
		console.error("Error getting tenant:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to get tenant",
				data: null,
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

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

		// Validate required params
		if (!slug) {
			console.error("Error updating tenant: ", { slug });
			return NextResponse.json(
				{
					success: false,
					message: "Tenant slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Validate required fields
		if (!body.data) {
			console.error("Error updating tenant: ", { slug });
			return NextResponse.json(
				{
					success: false,
					message: "Update data is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		// const data = await auth.api.updateOrganization({
		// 	body: {
		// 		data: body.data,
		// 		organizationId: organizationId,
		// 	},
		// 	headers: await headers(),
		// });

		const data = await prisma.organization.update({
			where: { slug },
			data: body.data,
		});

		return NextResponse.json({
			success: true,
			message: "Tenant updated successfully",
			data,
		});
	} catch (error) {
		console.error("Error updating tenant:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update tenant",
				data: null,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

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

		// Validate required params
		if (!slug) {
			return NextResponse.json(
				{
					success: false,
					message: "Tenant slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await prisma.organization.delete({ where: { slug } });

		return NextResponse.json({
			success: true,
			message: "Tenant deleted successfully",
			data,
		});
	} catch (error) {
		console.error("Error deleting tenant:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete tenant",
				data: null,
			},
			{ status: 500 }
		);
	}
}
