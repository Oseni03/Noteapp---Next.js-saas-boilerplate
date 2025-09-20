import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Get invitation
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ invitationId: string }> }
) {
	try {
		const { invitationId } = await params;

		const data = await auth.api.getInvitation({
			query: {
				id: invitationId,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Invitation retrieved successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to get invitation" },
				data: null,
			},
			{ status: 500 }
		);
	}
}

// Cancel invitation
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ invitationId: string }> }
) {
	try {
		const { invitationId } = await params;

		await auth.api.cancelInvitation({
			body: {
				invitationId,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Invitation cancelled successfully",
			data: null,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to cancel invitation" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
