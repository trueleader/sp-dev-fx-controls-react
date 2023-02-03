import type { IErrorInfo } from "../ErrorInfo/IErrorInfo";
import type { IComment } from "../Comments/IComment";
import type { IAddCommentPayload, IPageInfo } from "../../models";
import type { ECommentAction } from "../../common/ECommentAction";
import type { IListItemCommentsState } from "./IListItemCommentsState";
import { EListItemCommentsStateTypes } from "./EListItemCommentsStateTypes";


export type ListItemCommentsStateReducerAction =
	| { type: EListItemCommentsStateTypes.SET_ERROR_INFO; payload?: IErrorInfo; }
	| { type: EListItemCommentsStateTypes.SET_LIST_ITEM_COMMENTS; payload: Array<IComment>; }
	| { type: EListItemCommentsStateTypes.SET_IS_LOADING; payload: boolean; }
	| { type: EListItemCommentsStateTypes.SET_IS_SCROLLING; payload: boolean; }
	| { type: EListItemCommentsStateTypes.SET_DATA_PAGE_INFO; payload: IPageInfo; }
	| { type: EListItemCommentsStateTypes.SET_COMMENT_ACTION; payload?: ECommentAction; }
	| { type: EListItemCommentsStateTypes.SET_ADD_COMMENT; payload: IAddCommentPayload; }
	| { type: EListItemCommentsStateTypes.SET_SELECTED_COMMENT; payload: IComment; };

export const listItemCommentsStateReducer = (state: IListItemCommentsState, action: ListItemCommentsStateReducerAction): IListItemCommentsState =>
{
	switch (action.type)
	{
		case EListItemCommentsStateTypes.SET_ERROR_INFO:
			return { ...state, errorInfo: action.payload };
		case EListItemCommentsStateTypes.SET_LIST_ITEM_COMMENTS:
			return { ...state, comments: action.payload };
		case EListItemCommentsStateTypes.SET_IS_LOADING:
			return { ...state, isLoading: action.payload };
		case EListItemCommentsStateTypes.SET_IS_SCROLLING:
			return { ...state, isScrolling: action.payload };
		case EListItemCommentsStateTypes.SET_DATA_PAGE_INFO:
			return { ...state, pageInfo: action.payload };
		case EListItemCommentsStateTypes.SET_COMMENT_ACTION:
			return { ...state, commentAction: action.payload };
		case EListItemCommentsStateTypes.SET_ADD_COMMENT:
			return { ...state, commentToAdd: action.payload };
		case EListItemCommentsStateTypes.SET_SELECTED_COMMENT:
			return { ...state, selectedComment: action.payload };
		default:
			return state;
	}
};
