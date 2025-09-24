import { getOrganizationById } from "@/server/organizations";
import { getCurrentUser } from "@/server/users";
import { Member, Organization } from "@/types";
import { Invitation } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrganizationState = {
	activeOrganization?: Organization;
	members: Member[];
	invitations: Invitation[];
	organizations: Organization[];
	isAdmin: boolean;
	isLoading: boolean;
};

type OrganizationActions = {
	setActiveOrganization: (organizationId: string) => Promise<void>;
	setOrganizationData: (
		organization: Organization,
		members: Member[],
		invitations: Invitation[]
	) => void;
	setOrganizations: (organizations: Organization[]) => Promise<void>;
	addOrganization: (organization: Organization) => Promise<void>;
	updateOrganization: (organization: Organization) => Promise<void>;
	removeOrganization: (organizationId: string) => Promise<void>;
	addInvitation: (invitation: Invitation) => Promise<void>;
	removeInvite: (invitationId: string) => Promise<void>;
	updateMember: (member: Member) => Promise<void>;
	removeMember: (memberId: string) => Promise<void>;
	setLoading: (loading: boolean) => void;
	setAdmin: (loading: boolean) => void;
};

export type OrganizationStore = OrganizationState & OrganizationActions;

export const defaultInitState: OrganizationState = {
	activeOrganization: undefined,
	members: [],
	invitations: [],
	organizations: [],
	isAdmin: false,
	isLoading: false,
};

export const createOrganizationStore = (
	initState: OrganizationState = defaultInitState
) => {
	return create<OrganizationStore>()(
		persist(
			(set, get) => ({
				...initState,
				// Separate sync function for setting organization data
				setOrganizationData: (organization, members, invitations) => {
					set((state) => ({
						...state,
						activeOrganization: organization,
						members: members,
						invitations: invitations,
						isLoading: false,
					}));
				},

				setLoading: (loading: boolean) => {
					set((state) => ({ ...state, isLoading: loading }));
				},

				setAdmin: (isAdmin: boolean) => {
					set((state) => ({ ...state, isAdmin }));
				},

				// Async function that handles the data fetching properly
				setActiveOrganization: async (organizationId) => {
					const currentOrg = get().activeOrganization;

					// Don't refetch if it's the same organization
					if (currentOrg?.id === organizationId) {
						return;
					}

					// Set loading state
					get().setLoading(true);

					try {
						const { data, success } = await getOrganizationById(
							organizationId
						);

						const session = await getCurrentUser();

						const isAdmin = !!data?.members?.find(
							(member) =>
								member.userId == session?.user?.id &&
								member.role == "admin"
						);

						if (success && data) {
							// Use the sync function to update state
							get().setOrganizationData(
								data as Organization,
								(data?.members as Member[]) || [],
								data?.invitations || []
							);
							get().setAdmin(isAdmin);
						} else {
							get().setLoading(false);
						}
					} catch (error) {
						console.error("Error fetching organization:", error);
						get().setLoading(false);
					}
				},
				setOrganizations: async (organizations) => {
					set((state) => ({
						...state,
						organizations: [
							...state.organizations,
							...organizations,
						],
					}));
				},
				addOrganization: async (organization) => {
					set((state) => ({
						...state,
						organizations: [...state.organizations, organization],
					}));
				},
				updateOrganization: async (organization) => {
					set((state) => ({
						...state,
						activeOrganization: organization,
					}));
				},
				removeOrganization: async (organizationId) => {
					set((state) => ({
						...state,
						organizations: state.organizations.filter(
							(org) => org.id !== organizationId
						),
					}));
				},
				addInvitation: async (invitation) => {
					set((state) => ({
						...state,
						invitations: [...state.invitations, invitation],
					}));
				},
				removeInvite: async (invitationId) => {
					set((state) => ({
						...state,
						invitations: state.invitations.filter(
							(invite) => invite.id !== invitationId
						),
					}));
				},
				updateMember: async (member) => {
					set((state) => ({
						...state,
						members: state.members.map((m) => {
							if (m.id === member.id) {
								return member;
							}
							return m;
						}),
					}));
				},
				removeMember: async (memberId) => {
					set((state) => ({
						...state,
						members: state.members.filter(
							(member) => member.id !== memberId
						),
					}));
				},
			}),
			{ name: "organization-store" }
		)
	);
};
