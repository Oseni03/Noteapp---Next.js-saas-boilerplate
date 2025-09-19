"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Building2, CheckCircle, Crown, Loader2, Zap } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { SUBSCRIPTION_PLANS } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { useAuthState } from "@/hooks/use-auth";

const SubscriptionCard = () => {
	const { activeOrganization } = useAuthState();
	const [selectedPlan, setSelectedPlan] = useState("free");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubscriptionUpgrade = async () => {
		try {
			setIsLoading(true);
			toast.loading("Updating subscription...");
			const response = await fetch(
				`/api/tenants/${activeOrganization?.slug}/upgrade`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						plan: selectedPlan,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(
					`Failed to update tenent subscription: ${response.statusText}`
				);
			}

			const { message } = await response.json();

			toast.dismiss();
			toast.success(message || "Tenant subscription updated successful");
		} catch (error) {
			console.error("Error updating tenant subscription:", error);
			toast.dismiss();
			toast.error("Error updating tenant subscription");
		} finally {
			setIsLoading(false);
		}
	};

	const getSubscriptionFeatures = (subscription: string) => {
		const plan = SUBSCRIPTION_PLANS.find(
			(plan) => plan.id === subscription
		);

		return plan?.features;
	};

	const getSubscriptionIcon = (subscription: string) => {
		switch (subscription) {
			case "enterprise":
				return <Crown className="w-5 h-5 text-purple-500" />;
			case "pro":
				return <Zap className="w-5 h-5 text-blue-500" />;
			default:
				return <Building2 className="w-5 h-5 text-gray-500" />;
		}
	};

	return (
		<Dialog>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{activeOrganization &&
							getSubscriptionIcon(
								activeOrganization?.subscription || "free"
							)}
						Subscription Plan
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold capitalize">
								{activeOrganization?.subscription} Plan
							</h3>
							<p className="text-muted-foreground">
								Perfect for{" "}
								{activeOrganization?.subscription ===
								"enterprise"
									? "large organizations"
									: activeOrganization?.subscription === "pro"
									? "growing teams"
									: "small teams"}
							</p>
						</div>
						<DialogTrigger asChild>
							<Button variant="outline">
								{activeOrganization?.subscription ===
								"enterprise"
									? "Contact Sales"
									: "Upgrade Plan"}
							</Button>
						</DialogTrigger>
					</div>

					<div className="border-t pt-4">
						<h4 className="font-medium mb-3">Features included:</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							{activeOrganization &&
								getSubscriptionFeatures(
									activeOrganization.subscription || "free"
								)?.map((feature, index) => (
									<div
										key={index}
										className="flex items-center gap-2 text-sm"
									>
										<div className="w-1.5 h-1.5 rounded-full bg-primary" />
										{feature}
									</div>
								))}
						</div>
					</div>
				</CardContent>
			</Card>
			<DialogContent showCloseButton={true}>
				<DialogHeader>
					<DialogTitle>Upgrade subscription</DialogTitle>
					<DialogDescription>
						Make changes to organization subscription here.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="space-y-3">
						{SUBSCRIPTION_PLANS.map((plan) => (
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
												<plan.icon className="w-4 h-4" />
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
													<span>{plan.period}</span>
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
												.map((feature, index) => (
													<div
														key={index}
														className="flex items-center gap-1 text-xs text-muted-foreground"
													>
														<CheckCircle className="w-3 h-3 text-success" />
														{feature}
													</div>
												))}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
					<Button onClick={handleSubscriptionUpgrade}>
						Update{" "}
						{isLoading && (
							<Loader2 className="size-4 animate-spin" />
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SubscriptionCard;
