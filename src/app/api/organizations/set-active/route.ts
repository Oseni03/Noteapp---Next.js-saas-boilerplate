import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.organizationId) {
			return NextResponse.json(
				{
					success: false,
					message: "organizationId is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		console.log("setting active organization: ", { body });

		const data = await auth.api.setActiveOrganization({
			body: {
				organizationId: body.organizationId,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Active organization set successfully",
			data,
		});
	} catch (error) {
		console.error("Error setting active organization:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to set active organization",
				data: null,
			},
			{ status: 500 }
		);
	}
}
