import { ServiceScope } from "@microsoft/sp-core-library";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import * as React from "react";

import { AppContext } from "./common";
import { ListItemCommentsStateProvider } from "./components/ListItemCommentsStateProvider";
import { CommentsList } from "./components/Comments/CommentsList";


export interface IListItemCommentsProps
{
	webUrl?: string;
	listId: string;
	itemId: string;
	serviceScope: ServiceScope;
	numberCommentsPerPage?: 5 | 10 | 15 | 20;
	label?: string;
}


export const ListItemComments: React.FunctionComponent<IListItemCommentsProps> = (
	props: IListItemCommentsProps
) =>
{
	const { webUrl, listId, itemId, serviceScope, numberCommentsPerPage, label } = props;

	const ctx = React.useMemo(
		() => ({ webUrl, listId, itemId, serviceScope, label, numberCommentsPerPage }),
		[webUrl, listId, itemId, serviceScope, label, numberCommentsPerPage]
	);


	if (!listId && !itemId)
		return null;

	return (<ListItemCommentsStateProvider>
		<AppContext.Provider value={ctx}>
			<Stack>
				<Text variant={"medium"} style={{ fontWeight: 600 }}>{label}</Text>
				<CommentsList />
			</Stack>
		</AppContext.Provider>
	</ListItemCommentsStateProvider>);
};
