import type { IErrorInfo } from "../ErrorInfo/IErrorInfo";
import type { IComment } from "../Comments/IComment";
import type { IAddCommentPayload, IPageInfo } from "../../models";
import type { ECommentAction } from "../../common/ECommentAction";

// Global State (Store)
export interface IListItemCommentsState
{
	errorInfo?: IErrorInfo;
	comments: Array<IComment>;
	isLoading: boolean;
	isScrolling: boolean;
	pageInfo?: IPageInfo;
	commentAction?: ECommentAction;
	commentToAdd?: IAddCommentPayload;
	selectedComment?: IComment;
}
