"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
	type OrganizationStore,
	createOrganizationStore,
} from "@/zustand/stores/organization-store";

export type OrganizationStoreApi = ReturnType<typeof createOrganizationStore>;

export const OrganizationStoreContext = createContext<
	OrganizationStoreApi | undefined
>(undefined);

export interface OrganizationStoreProviderProps {
	children: ReactNode;
}

export const OrganizationStoreProvider = ({
	children,
}: OrganizationStoreProviderProps) => {
	const storeRef = useRef<OrganizationStoreApi | null>(null);
	if (storeRef.current === null) {
		storeRef.current = createOrganizationStore();
	}

	return (
		<OrganizationStoreContext.Provider value={storeRef.current}>
			{children}
		</OrganizationStoreContext.Provider>
	);
};

export const useOrganizationStore = <T,>(
	selector: (store: OrganizationStore) => T
): T => {
	const organizationStoreContext = useContext(OrganizationStoreContext);

	if (!organizationStoreContext) {
		throw new Error(
			`useOrganizationStore must be used within OrganizationStoreProvider`
		);
	}

	return useStore(organizationStoreContext, selector);
};
