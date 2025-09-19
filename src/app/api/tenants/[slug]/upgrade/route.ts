import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/server/permissions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		const { success, error } = await isAdmin();

		if (!success || error) {
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized",
					data: null,
				},
				{ status: 401 }
			);
		}

		// Validate required params
		if (!slug) {
			return NextResponse.json(
				{
					success: false,
					message: "Tenant slug is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const tenant = await prisma.organization.findFirst({
			where: { slug },
		});

		// Validate required fields
		if (!tenant) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid tenant slug",
					data: null,
				},
				{ status: 400 }
			);
		}

		const body = await request.json();

		// Validate required fields
		if (!body.plan) {
			return NextResponse.json(
				{
					success: false,
					message: "Subscription is required",
					data: null,
				},
				{ status: 400 }
			);
		}

		const data = await auth.api.updateOrganization({
			body: {
				data: { subscription: body.plan },
				organizationId: tenant.id,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Tenant subscriptio updated successfully",
			data,
		});
	} catch (error) {
		console.error("Error updating tenant subscription:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update tenant subscription",
				data: null,
			},
			{ status: 500 }
		);
	}
}
