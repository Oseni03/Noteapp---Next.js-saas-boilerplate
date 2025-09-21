import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate required fields
		if (!body.slug) {
			return NextResponse.json(
				{
					success: false,
					message: "Slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.checkOrganizationSlug({
			body: {
				slug: body.slug, // required
			},
		});

		return NextResponse.json({
			success: true,
			message: "Slug availability checked successfully",
			data,
		});
	} catch (error) {
		console.error("Error checking tenant slug:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to check tenent slug",
				data: null,
			},
			{ status: 500 }
		);
	}
}
