import type { IListItemCommentsState } from "./IListItemCommentsState";
import type { ListItemCommentsStateReducerAction } from "./listItemCommentsStateReducer";

export interface IListItemCommentsStateContext
{
	listItemCommentsState: IListItemCommentsState;
	setListItemCommentsState: React.Dispatch<ListItemCommentsStateReducerAction>;
}
