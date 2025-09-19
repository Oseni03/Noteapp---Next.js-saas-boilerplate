import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Email parameter is required" },
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.listUserInvitations({
			query: {
				email,
			},
		});

		return NextResponse.json({
			success: true,
			message: "User invitations retrieved successfully",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to list user invitations" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
