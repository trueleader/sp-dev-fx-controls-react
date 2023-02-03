import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import React, { useCallback, useContext, useEffect, useRef } from "react";

import type { IPageInfo } from "../../models";
import type { IAddCommentPayload } from "../../models/IAddCommentPayload";
import type { IErrorInfo } from "../ErrorInfo/IErrorInfo";
import { ECommentAction } from "../../common/ECommentAction";
import { useSpAPI } from "../../hooks";
import { getScrollPosition } from "../../utils/utils";
import { EListItemCommentsStateTypes, ListItemCommentsStateContext } from "../ListItemCommentsStateProvider";
import { AddComment } from "../AddComment";
import { RenderError } from "./RenderError";
import { RenderSpinner } from "./RenderSpinner";
import { RenderComments } from "./RenderComments";
import { useListItemCommentsStyles } from "./useListItemCommentsStyles";
import strings from "ControlStrings";


export const CommentsList: React.FunctionComponent = () =>
{
	const { listItemCommentsState, setListItemCommentsState } = useContext(ListItemCommentsStateContext);
	const { configurationListClasses } = useListItemCommentsStyles();
	const sp = useSpAPI();
	const { comments, isScrolling, pageInfo, commentAction, commentToAdd, selectedComment, errorInfo } = listItemCommentsState;
	const scrollPanelRef = useRef<HTMLDivElement | null>(null);

	const loadComments = useCallback(
		async () =>
		{
			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_IS_LOADING, payload: true });

			try
			{
				const { comments, hasMore, nextLink } = await sp.getListItemComments();
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_LIST_ITEM_COMMENTS, payload: comments });
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_DATA_PAGE_INFO, payload: { hasMore, nextLink } as IPageInfo });
			}
			catch (error)
			{
				const errorInfo = { showError: true, error } as IErrorInfo;
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ERROR_INFO, payload: errorInfo });
			}

			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_COMMENT_ACTION });
			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_IS_LOADING, payload: false });
		},
		[sp, setListItemCommentsState]
	);

	const loadNextComments = React.useCallback(
		async () =>
		{
			if (isScrolling || !scrollPanelRef.current) return;

			const scrollPosition = getScrollPosition(scrollPanelRef.current);
			if (pageInfo?.hasMore && scrollPosition > 90)
			{
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_IS_SCROLLING, payload: true });

				const { comments: newComments, hasMore, nextLink } = await sp.getNextPageOfComments(pageInfo.nextLink);
				setListItemCommentsState({
					type: EListItemCommentsStateTypes.SET_LIST_ITEM_COMMENTS,
					payload: [...comments, ...newComments]
				});
				setListItemCommentsState({
					type: EListItemCommentsStateTypes.SET_DATA_PAGE_INFO,
					payload: { hasMore, nextLink } as IPageInfo
				});

				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_IS_SCROLLING, payload: false });
			}
		},
		[isScrolling, pageInfo, setListItemCommentsState, sp, comments]
	);

	const onAddComment = useCallback(
		async (commentText: IAddCommentPayload) =>
		{
			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ERROR_INFO });

			try
			{
				await sp.addComment(commentText);
			}
			catch (error)
			{
				const errorInfo = { showError: true, error } as IErrorInfo;
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ERROR_INFO, payload: errorInfo });
				return;
			}

			await loadComments();
		},
		[loadComments, setListItemCommentsState, sp]
	);

	const onDeleteComment = useCallback(
		async (commentId: number) =>
		{
			if (!commentId) return;

			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ERROR_INFO });

			try
			{
				await sp.deleteComment(commentId);
			}
			catch (error)
			{
				const errorInfo = { showError: true, error } as IErrorInfo;
				setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ERROR_INFO, payload: errorInfo });
				return;
			}

			await loadComments();
		},
		[loadComments, setListItemCommentsState, sp]
	);

	const handleScroll = React.useCallback(() => void loadNextComments(), [loadNextComments]);


	useEffect(() => void loadComments(), [loadComments]);

	useEffect(
		() =>
		{
			if (!commentAction) return;

			switch (commentAction)
			{
				case ECommentAction.ADD:
					if (commentToAdd)
						void onAddComment(commentToAdd);
					break;
				case ECommentAction.DELETE:
					if (selectedComment)
						void onDeleteComment(+selectedComment.id);
					break;
			}
		},
		[commentAction, selectedComment, commentToAdd, onAddComment, onDeleteComment]
	);


	return (
		<>
			<Stack tokens={{ childrenGap: 10, maxWidth: 335 }}>
				<RenderError errorInfo={errorInfo} />
				<AddComment />
				<Text variant="small" block style={{ fontWeight: 600 }}>
					{strings.ListItemCommentsLabel}
				</Text>
				<div className={configurationListClasses.titlesContainer} onScroll={handleScroll} ref={scrollPanelRef}>
					<Stack>
						<RenderComments />
					</Stack>
				</div>
			</Stack>
			{<RenderSpinner />}
		</>
	);
};
