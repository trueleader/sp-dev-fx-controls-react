import type { Person } from "@microsoft/microsoft-graph-types";
import type { GraphRequest } from "@microsoft/microsoft-graph-client";
import type { MSGraphClientV3 } from "@microsoft/sp-http";
import { MSGraphClientFactory } from "@microsoft/sp-http";
import { useCallback, useContext, useMemo } from "react";

import type { IUserInfo, IUsersResults } from "../models/IUsersResults";
import type { IApiCollectionResult } from "./IApiCollectionResult";
import { AppContext } from "../common";


interface IReturnObject
{
	getUsers: (search: string) => Promise<IUsersResults>;
	getUsersNextPage: (nextLink: string) => Promise<IUsersResults>;
	getSuggestions: () => Promise<IUsersResults>;
}


export function useMsGraphAPI(): IReturnObject
{
	const appCtx = useContext(AppContext);
	if (!appCtx)
		throw new Error("No wrapping AppContext.Provider called");

	const { serviceScope } = appCtx;
	let graph: MSGraphClientV3 | undefined = undefined;
	serviceScope.whenFinished(() =>
	{
		void serviceScope.consume(MSGraphClientFactory.serviceKey).getClient("3").then((c) => { graph = c; });
	});

	const getSuggestions = useCallback(
		async (): Promise<IUsersResults> =>
		{
			if (!graph)
				throw new Error("ServiceScope not yet initialized MSGraphClient");

			const api = graph.api(`me/people`) as GraphRequest;
			const suggestions = await api
				.header("ConsistencyLevel", "eventual")
				.filter(`personType/class eq 'Person' and personType/subclass eq 'OrganizationUser'`)
				.orderby(`displayName`)
				.get() as IApiCollectionResult<Person>;

			const users = suggestions.value.map((p): IUserInfo => ({
				displayName: p.displayName ?? "",
				givenName: p.givenName ?? "",
				id: p.id ?? "",
				mail: p.scoredEmailAddresses?.find(x => x)?.address ?? ""
			}));

			return { users, hasMore: false, nextLink: undefined };
		},
		[graph]
	);

	const getUsers = useCallback(
		async (search: string): Promise<IUsersResults> =>
		{
			if (!graph)
				throw new Error("ServiceScope not yet initialized MSGraphClient");

			if (!search)
				return { users: [] };

			let filter = "";
			if (search)
			{
				const escapedSearch = search.replace("'", "''");
				filter = `mail ne null AND (startswith(mail,'${escapedSearch}') OR startswith(displayName,'${escapedSearch}'))`;
			}

			const api = graph.api(`/users`) as GraphRequest;
			const usersResults = await api
				.header("ConsistencyLevel", "eventual")
				.filter(filter)
				.orderby(`displayName`)
				.count(true)
				.top(25)
				.get() as IApiCollectionResult<IUserInfo>;

			return {
				users: usersResults.value,
				hasMore: usersResults["@odata.nextLink"] ? true : false,
				nextLink: usersResults["@odata.nextLink"] ?? undefined
			};
		},
		[graph]
	);

	const getUsersNextPage = useCallback(
		async (nextLink: string): Promise<IUsersResults> =>
		{
			if (!graph)
				throw new Error("ServiceScope not yet initialized MSGraphClient");

			const api = graph.api(nextLink) as GraphRequest;
			const usersResults = await api.get() as IApiCollectionResult<IUserInfo>;

			return {
				users: usersResults.value,
				hasMore: usersResults["@odata.nextLink"] ? true : false,
				nextLink: usersResults["@odata.nextLink"] ?? undefined
			};
		},
		[graph]
	);


	const service = useMemo(
		() => ({ getUsers, getUsersNextPage, getSuggestions }),
		[getUsers, getUsersNextPage, getSuggestions]
	);

	return service;
}

