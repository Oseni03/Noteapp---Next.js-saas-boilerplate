import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
	try {
		const data = await auth.api.getFullOrganization({
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
