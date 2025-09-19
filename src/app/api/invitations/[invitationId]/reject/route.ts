import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ invitationId: string }> }
) {
	try {
		const { invitationId } = await params;

		await auth.api.rejectInvitation({
			body: {
				invitationId,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Invitation rejected successfully",
			data: null,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to reject invitation" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
