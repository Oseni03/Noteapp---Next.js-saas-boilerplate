"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import slugify from "@sindresorhus/slugify";

export const getCurrentUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const currentUser = await prisma.user.findFirst({
		where: { id: session.user.id },
	});

	if (!currentUser) {
		redirect("/login");
	}

	return {
		...session,
		currentUser,
	};
};

export const signIn = async (email: string, password: string) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return {
			success: true,
			message: "Signed in successfully.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An unknown error occurred.",
		};
	}
};

export const signUp = async ({
	email,
	password,
	username,
	company,
}: {
	email: string;
	password: string;
	username: string;
	company: string;
}) => {
	try {
		const { user } = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: username,
			},
		});

		await auth.api.createOrganization({
			body: {
				name: company,
				slug: slugify(company),
				userId: user.id,
			},
		});

		return {
			success: true,
			message: "Signed up successfully.",
		};
	} catch (error) {
		const e = error as Error;

		return {
			success: false,
			message: e.message || "An unknown error occurred.",
		};
	}
};

export const getUsers = async (organizationId: string) => {
	try {
		const members = await prisma.member.findMany({
			where: { organizationId },
		});

		const users = await prisma.user.findMany({
			where: {
				id: { notIn: members.map((member) => member.userId) },
			},
		});

		return users;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await prisma.user.findFirst({
			where: { id: userId },
		});

		return { success: true, data: user };
	} catch (error) {
		console.error(error);
		return { success: false, error };
	}
};
