import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.tenantId) {
			return NextResponse.json(
				{
					success: false,
					message: "tenantId is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		console.log("setting active tenant: ", { body });

		const data = await auth.api.setActiveOrganization({
			body: {
				organizationId: body.tenantId,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Active tenant set successfully",
			data,
		});
	} catch (error) {
		console.error("Error setting active tenant:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to set active tenant",
				data: null,
			},
			{ status: 500 }
		);
	}
}
