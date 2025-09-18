import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ organizationId: string }> }
) {
	try {
		const { organizationId } = await params;

		// Validate required params
		if (!organizationId) {
			return NextResponse.json(
				{
					success: false,
					message: "Organization ID is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const { searchParams } = new URL(request.url);

		const data = await auth.api.getFullOrganization({
			query: {
				organizationId: organizationId,
				membersLimit: parseInt(
					searchParams.get("membersLimit") || "100"
				),
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Organization retrieved successfully",
			data,
		});
	} catch (error) {
		console.error("Error getting organization:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to get organization",
				data: null,
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ organizationId: string }> }
) {
	try {
		const { organizationId } = await params;

		// Validate required params
		if (!organizationId) {
			console.error("Error updating organization: ", { organizationId });
			return NextResponse.json(
				{
					success: false,
					message: "Organization ID is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Validate required fields
		if (!body.data) {
			console.error("Error updating organization: ", { organizationId });
			return NextResponse.json(
				{
					success: false,
					message: "Update data is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.updateOrganization({
			body: {
				data: body.data,
				organizationId: organizationId,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Organization updated successfully",
			data,
		});
	} catch (error) {
		console.error("Error updating organization:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update organization",
				data: null,
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ organizationId: string }> }
) {
	try {
		const { organizationId } = await params;

		// Validate required params
		if (!organizationId) {
			return NextResponse.json(
				{
					success: false,
					message: "Organization ID is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.deleteOrganization({
			body: {
				organizationId,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Organization deleted successfully",
			data,
		});
	} catch (error) {
		console.error("Error deleting organization:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to delete organization",
				data: null,
			},
			{ status: 500 }
		);
	}
}
