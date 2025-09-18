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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
	FileText,
	ArrowLeft,
	CheckCircle,
	Building2,
	Zap,
	Crown,
	Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "@/server/users";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		company: "",
		agreeTerms: false,
	});
	const [selectedPlan, setSelectedPlan] = useState("free");
	const [loading, setIsLoading] = useState(false);
	const router = useRouter();

	const plans = [
		{
			id: "free",
			name: "Free",
			price: "$0",
			period: "/month",
			maxUsers: 5,
			maxNotes: 50,
			icon: <Building2 className="w-4 h-4" />,
			features: ["5 users", "50 notes", "Basic support"],
		},
		{
			id: "pro",
			name: "Pro",
			price: "$19",
			period: "/month",
			maxUsers: 25,
			maxNotes: 500,
			icon: <Zap className="w-4 h-4" />,
			features: ["25 users", "500 notes", "Email support", "API access"],
			popular: true,
		},
		{
			id: "enterprise",
			name: "Enterprise",
			price: "Custom",
			period: "",
			maxUsers: 100,
			maxNotes: 1000,
			icon: <Crown className="w-4 h-4" />,
			features: ["Unlimited users", "1000 notes", "Priority support"],
		},
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const plan = plans.find((plan) => plan.id == selectedPlan);
		if (!plan) {
			toast.error("No plan selected");
			return;
		}

		const { success, message } = await signUp({
			email: formData.email,
			password: formData.password,
			username: formData.name,
			company: formData.company,
			maxNotes: plan.maxNotes,
			maxUsers: plan.maxUsers,
			subscription: plan.id,
		});

		if (success) {
			toast.success(
				`${message as string} Please check your email for verification.`
			);
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

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Plan Selection */}
					<div className="space-y-6">
						<div>
							<h2 className="text-xl font-semibold mb-4">
								Choose your plan
							</h2>
							<div className="space-y-3">
								{plans.map((plan) => (
									<Card
										key={plan.id}
										className={`cursor-pointer transition-all hover:shadow-md ${
											selectedPlan === plan.id
												? "ring-2 ring-primary"
												: ""
										}`}
										onClick={() => setSelectedPlan(plan.id)}
									>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
														{plan.icon}
													</div>
													<div>
														<div className="flex items-center gap-2">
															<span className="font-medium">
																{plan.name}
															</span>
															{plan.popular && (
																<Badge
																	variant="secondary"
																	className="text-xs"
																>
																	Popular
																</Badge>
															)}
														</div>
														<div className="text-sm text-muted-foreground">
															<span className="font-medium">
																{plan.price}
															</span>
															<span>
																{plan.period}
															</span>
														</div>
													</div>
												</div>
												<div
													className={`w-4 h-4 rounded-full border-2 ${
														selectedPlan === plan.id
															? "bg-primary border-primary"
															: "border-muted-foreground"
													}`}
												/>
											</div>
											<div className="mt-3 ml-11">
												<div className="flex flex-wrap gap-2">
													{plan.features
														.slice(0, 3)
														.map(
															(
																feature,
																index
															) => (
																<div
																	key={index}
																	className="flex items-center gap-1 text-xs text-muted-foreground"
																>
																	<CheckCircle className="w-3 h-3 text-success" />
																	{feature}
																</div>
															)
														)}
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
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
								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="name">
												Full Name
											</Label>
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
											<Label htmlFor="company">
												Company Name
											</Label>
											<Input
												id="company"
												name="company"
												placeholder="Acme Corp"
												value={formData.company}
												onChange={handleInputChange}
												required
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">
											Email Address
										</Label>
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
										<Label htmlFor="password">
											Password
										</Label>
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
										<Label
											htmlFor="terms"
											className="text-sm"
										>
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
										disabled={
											!formData.agreeTerms || loading
										}
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
		</div>
	);
};

export default Signup;
