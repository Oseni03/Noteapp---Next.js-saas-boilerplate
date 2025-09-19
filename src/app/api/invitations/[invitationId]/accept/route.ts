import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ invitationId: string }> }
) {
	try {
		const { invitationId } = await params;

		const data = await auth.api.acceptInvitation({
			body: {
				invitationId,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Invitation accepted successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to accept invitation" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
