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
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/server/users";
import { useAuthState } from "@/hooks/use-auth";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		agreeTerms: false,
	});
	const [loading, setIsLoading] = useState(false);
	const { isAuthenticated } = useAuthState();
	const router = useRouter();

	if (isAuthenticated) {
		router.push("/dashboard");
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const { success, message } = await signUp({
			email: formData.email,
			password: formData.password,
			username: formData.name,
		});

		if (success) {
			toast.success(`${message as string}`);
			router.push("/dashboard");
		} else {
			toast.error(message as string);
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
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
					<h1 className="text-3xl font-bold mb-2">
						Create your account
					</h1>
					<p className="text-muted-foreground">
						Start your free trial and experience the future of team
						collaboration
					</p>
				</div>

				{/* Signup Form */}
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Account Details</CardTitle>
							<CardDescription>
								Fill in your information to get started
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										name="name"
										placeholder="John Doe"
										value={formData.name}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="john@acme.com"
										value={formData.email}
										onChange={handleInputChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="Create a strong password"
										value={formData.password}
										onChange={handleInputChange}
										required
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Switch
										id="terms"
										checked={formData.agreeTerms}
										onCheckedChange={(checked) =>
											setFormData((prev) => ({
												...prev,
												agreeTerms: checked,
											}))
										}
									/>
									<Label htmlFor="terms" className="text-sm">
										I agree to the{" "}
										<Link
											href="#"
											className="text-primary hover:underline"
										>
											Terms of Service
										</Link>{" "}
										and{" "}
										<Link
											href="#"
											className="text-primary hover:underline"
										>
											Privacy Policy
										</Link>
									</Label>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={!formData.agreeTerms || loading}
								>
									Start Free Trial{" "}
									{loading && (
										<Loader2 className="size-4 animate-spin" />
									)}
								</Button>
							</form>
						</CardContent>
					</Card>

					<div className="text-center text-sm mt-6">
						<span className="text-muted-foreground">
							Already have an account?{" "}
						</span>
						<Link
							href="/login"
							className="text-primary hover:underline font-medium"
						>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
