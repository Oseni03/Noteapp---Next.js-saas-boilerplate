"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/server/users";
import { authClient } from "@/lib/auth-client";

const Login = () => {
	const { user } = authClient.useSession().data || {};
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setIsLoading] = useState(false);
	const router = useRouter();

	if (!!user) {
		router.push("/dashboard");
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const { success, message } = await signIn(email, password);

		if (success) {
			toast.success(message as string);
			router.push("/dashboard");
		} else {
			toast.error(message as string);
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-6">
				{/* Header */}
				<div className="text-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to homepage
					</Link>
					<div className="flex items-center justify-center gap-2 mb-6">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
							<FileText className="w-4 h-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold">NotesApp</span>
					</div>
				</div>

				{/* Login Form */}
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Welcome back</CardTitle>
						<CardDescription>
							Sign in to your account to continue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={loading}
							>
								Sign In{" "}
								{loading && (
									<Loader2 className="size-4 animate-spin" />
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Sign up link */}
				<div className="text-center text-sm">
					<span className="text-muted-foreground">
						Don&rsquo;t have an account?{" "}
					</span>
					<Link
						href="/signup"
						className="text-primary hover:underline font-medium"
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
