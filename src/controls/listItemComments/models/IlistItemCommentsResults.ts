import type { IComment } from "../components/Comments/IComment";

export interface IListItemCommentsResults
{
	comments: Array<IComment>;
	hasMore?: boolean;
	nextLink?: string;
}
