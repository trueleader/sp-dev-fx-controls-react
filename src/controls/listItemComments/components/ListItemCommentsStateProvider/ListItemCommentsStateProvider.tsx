import React, { createContext, useReducer } from "react";

import type { IListItemCommentsState } from "./IListItemCommentsState";
import type { IListItemCommentsStateContext } from "./IListItemCommentsStateContext";
import { listItemCommentsStateReducer } from "./listItemCommentsStateReducer";

const initialState: IListItemCommentsState = {
	errorInfo: undefined,
	comments: [],
	isLoading: false,
	isScrolling: false
};

const stateInit: IListItemCommentsStateContext = {
	listItemCommentsState: initialState,
	setListItemCommentsState: () => { return; }
};

// store
export const ListItemCommentsStateContext = createContext<IListItemCommentsStateContext>(stateInit);
export const ListItemCommentsStateProvider = (props: { children: React.ReactNode; }): JSX.Element =>
{
	const [listItemCommentsState, setListItemCommentsState] = useReducer(listItemCommentsStateReducer, initialState);

	return (
		<ListItemCommentsStateContext.Provider value={{ listItemCommentsState, setListItemCommentsState }}>
			{props.children}
		</ListItemCommentsStateContext.Provider>
	);
};
