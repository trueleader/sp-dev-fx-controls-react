import type { ISPHttpClientOptions } from "@microsoft/sp-http";
import { SPHttpClient } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";
import React, { useContext, useCallback } from "react";

import type { IAddCommentPayload, IListItemCommentsResults } from "../models";
import type { IApiCollectionResult } from "./IApiCollectionResult";
import type { IComment } from "../components/Comments/IComment";
import { AppContext } from "../common";


interface IReturnObject
{
	getListItemComments: () => Promise<IListItemCommentsResults>;
	getNextPageOfComments: (nextLink: string) => Promise<IListItemCommentsResults>;
	addComment: (comment: IAddCommentPayload) => Promise<IComment>;
	deleteComment: (commentId: number) => Promise<void>;
}

export function useSpAPI(): IReturnObject
{
	const appCtx = useContext(AppContext);
	if (!appCtx)
		throw new Error("No wrapping AppContext.Provider called");

	const { serviceScope, webUrl, listId, itemId, numberCommentsPerPage } = appCtx;
	//https://contoso.sharepoint.com/sites/ThePerspective/_api/web/lists(@a1)/GetItemById(@a2)/Comments(@a3)?@a1=%27%7BE738C4B3%2D6CFF%2D493A%2DA8DA%2DDBBF4732E3BF%7D%27&@a2=%2729%27&@a3=%273%27
	let apiUrl = webUrl ? `${webUrl}/_api` : "/_api";
	let sp: SPHttpClient | undefined = undefined;
	serviceScope.whenFinished(() =>
	{
		sp = serviceScope.consume(SPHttpClient.serviceKey);

		if (!webUrl)
			apiUrl = `${serviceScope.consume(PageContext.serviceKey).web.absoluteUrl}/_api`;
	});

	const deleteComment = useCallback(
		async (commentId: number): Promise<void> =>
		{
			if (!sp)
				throw new Error("ServiceScope not yet initialized SPHttpClient");

			const url = `${apiUrl}/web/lists(@a1)/GetItemById(@a2)/Comments(@a3)?@a1='${listId}'&@a2='${itemId}'&@a3='${commentId}'`;
			const spOpts: ISPHttpClientOptions = { method: "DELETE" };
			await sp.fetch(`${url}`, SPHttpClient.configurations.v1, spOpts);
		},
		[apiUrl, itemId, listId, sp]
	);

	const addComment = useCallback(
		async (comment: IAddCommentPayload): Promise<IComment> =>
		{
			if (!sp)
				throw new Error("ServiceScope not yet initialized SPHttpClient");

			const url = `${apiUrl}/web/lists(@a1)/GetItemById(@a2)/Comments()?@a1='${listId}'&@a2='${itemId}'`;
			const spOpts: ISPHttpClientOptions = {
				body: `{ "text": "${comment.text}", "mentions": ${JSON.stringify(comment.mentions)}}`
			};
			const response = await sp.post(`${url}`, SPHttpClient.configurations.v1, spOpts);

			return (await response.json()) as IComment;
		},
		[apiUrl, itemId, listId, sp]
	);

	const getCommentsByUrl = useCallback(
		async (url: string): Promise<IListItemCommentsResults> =>
		{
			if (!sp)
				throw new Error("ServiceScope not yet initialized SPHttpClient");

			const response = await sp.get(`${url}`, SPHttpClient.configurations.v1);

			const results = (await response.json()) as IApiCollectionResult<IComment>;

			return {
				comments: results.value,
				hasMore: results["@odata.nextLink"] ? true : false,
				nextLink: results["@odata.nextLink"] ?? undefined
			};
		},
		[sp]
	);

	const getListItemComments = useCallback(
		(): Promise<IListItemCommentsResults> =>
		{
			const url = `${apiUrl}/web/lists(@a1)/GetItemById(@a2)/GetComments()?@a1='${listId}'&@a2='${itemId}'&$top=${numberCommentsPerPage ?? 10}`;
			return getCommentsByUrl(url);
		},
		[apiUrl, getCommentsByUrl, itemId, listId, numberCommentsPerPage]
	);


	const service = React.useMemo(
		() => ({ getListItemComments, getNextPageOfComments: getCommentsByUrl, addComment, deleteComment }),
		[getListItemComments, getCommentsByUrl, addComment, deleteComment]
	);

	return service;
}
