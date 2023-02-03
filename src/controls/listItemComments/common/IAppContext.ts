import type { ServiceScope } from "@microsoft/sp-core-library";

export interface IAppContext
{
	serviceScope: ServiceScope;
	webUrl?: string;
	listId: string;
	itemId: string;
	numberCommentsPerPage?: number;
	label?: string;
}
