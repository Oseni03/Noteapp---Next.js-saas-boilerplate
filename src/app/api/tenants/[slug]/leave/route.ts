import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		const tenant = await prisma.organization.findFirst({
			where: { slug },
		});

		if (!tenant) {
			return NextResponse.json(
				{
					success: false,
					error: { message: "Organization not found" },
					data: null,
				},
				{ status: 404 }
			);
		}

		// Note: Using authClient.organization.leave instead of auth.api
		await auth.api.leaveOrganization({
			body: {
				organizationId: tenant.id,
			},
			headers: await headers(),
		});

		return NextResponse.json({
			success: true,
			message: "Successfully left organization",
			data: null,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error || { message: "Failed to leave organization" },
				data: null,
			},
			{ status: 500 }
		);
	}
}
