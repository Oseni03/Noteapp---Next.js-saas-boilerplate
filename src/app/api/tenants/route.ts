import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
	try {
		const data = await auth.api.listOrganizations({
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Tenants retrieved successfully",
			data,
		});
	} catch (error) {
		console.error("Error listing tenants:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to list tenants",
				data: null,
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate required fields
		if (!body.name) {
			return NextResponse.json(
				{
					success: false,
					message: "Tenant name is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		if (!body.slug) {
			return NextResponse.json(
				{
					success: false,
					message: "Tenant slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.createOrganization({
			body: {
				name: body.name, // required
				slug: body.slug, // required
				logo: body.logo,
				metadata: body.metadata,
				userId: body.userId, // server-only
				keepCurrentActiveOrganization:
					body.keepCurrentActiveOrganization || false,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Tenant created successfully",
			data,
		});
	} catch (error) {
		console.error("Error creating tenant:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to create tenant",
				data: null,
			},
			{ status: 500 }
		);
	}
}
