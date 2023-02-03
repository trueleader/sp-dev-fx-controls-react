import { useBoolean } from "@fluentui/react-hooks";
import { IconButton } from "@fluentui/react/lib/Button";
import { DocumentCard, DocumentCardDetails } from "@fluentui/react/lib/DocumentCard";
import { List } from "@fluentui/react/lib/List";
import { Stack } from "@fluentui/react/lib/Stack";
import * as React from "react";

import type { IComment } from "./IComment";
import { ECommentAction } from "../..";
import { ConfirmDelete } from "../ConfirmDelete/ConfirmDelete";
import { EListItemCommentsStateTypes, ListItemCommentsStateContext } from "../ListItemCommentsStateProvider";
import { CommentItem } from "./CommentItem";
import { RenderSpinner } from "./RenderSpinner";
import { useListItemCommentsStyles } from "./useListItemCommentsStyles";

export interface IRenderCommentsProps { }

export const RenderComments: React.FunctionComponent<IRenderCommentsProps> = () =>
{
	const { listItemCommentsState: { comments, isLoading }, setListItemCommentsState } = React.useContext(ListItemCommentsStateContext);

	const [hideDialog, { toggle: setHideDialog }] = useBoolean(true);

	const onRenderCell = React.useCallback(
		(comment?: IComment, index?: number): React.ReactNode =>
		{
			if (!comment)
				return null;

			return (<ListCell comment={comment} index={index ?? 0} onAfterDelete={setHideDialog} />);
		},
		[setHideDialog]
	);

	const handleDismiss = React.useCallback(
		(deleteComment: boolean) =>
		{
			if (deleteComment)
			{
				setListItemCommentsState({
					type: EListItemCommentsStateTypes.SET_COMMENT_ACTION,
					payload: ECommentAction.DELETE
				});
			}
			setHideDialog();
		},
		[setHideDialog, setListItemCommentsState]
	);


	return (
		<>
			{isLoading ? <RenderSpinner /> : <List items={comments} onRenderCell={onRenderCell} />}
			<ConfirmDelete hideDialog={hideDialog} onDismiss={handleDismiss} />
		</>
	);
};


function ListCell(props: { comment: IComment; index: number; onAfterDelete: () => void; }): React.ReactElement
{
	const { comment, index, onAfterDelete } = props;
	const { setListItemCommentsState } = React.useContext(ListItemCommentsStateContext);
	const { documentCardStyles, itemContainerStyles, deleteButtonContainerStyles } = useListItemCommentsStyles();

	const handleDeleteClick = React.useCallback(
		() =>
		{
			setListItemCommentsState({
				type: EListItemCommentsStateTypes.SET_SELECTED_COMMENT,
				payload: comment
			});
			onAfterDelete();
		},
		[comment, onAfterDelete, setListItemCommentsState]
	);

	return (
		<DocumentCard styles={documentCardStyles} key={index}>
			<Stack horizontal horizontalAlign="end" styles={deleteButtonContainerStyles}>
				<IconButton
					iconProps={{ iconName: "Delete" }}
					style={{ fontSize: 10 }}
					onClick={handleDeleteClick}
				/>
			</Stack>
			<DocumentCardDetails styles={{ root: { paddingTop: 15 } }}>
				<Stack
					horizontal
					horizontalAlign="start"
					verticalAlign="center"
					tokens={{ childrenGap: 12 }}
					styles={itemContainerStyles}
				>
					<CommentItem comment={comment} />
				</Stack>
			</DocumentCardDetails>
		</DocumentCard>
	);
}

