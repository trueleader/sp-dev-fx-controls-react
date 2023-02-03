import type { IDialogContentProps } from "@fluentui/react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { DocumentCard, DocumentCardDetails } from "@fluentui/react/lib/DocumentCard";
import { Stack } from "@fluentui/react/lib/Stack";
import * as React from "react";

import { ListItemCommentsStateContext } from "../ListItemCommentsStateProvider";
import { useListItemCommentsStyles } from "../Comments/useListItemCommentsStyles";
import { CommentItem } from "../Comments/CommentItem";
import strings from "ControlStrings";


interface IConfirmDeleteProps
{
	hideDialog: boolean;
	onDismiss: (deleteComment: boolean) => void;
}


const modelProps = {
	isBlocking: false,
	styles: { main: { maxWidth: 450 } }
};

const dialogContentProps: IDialogContentProps = {
	type: DialogType.largeHeader,
	title: strings.ListItemCommentsDialogDeleteTitle,
	styles: { subText: { fontWeight: 600 } },
	subText: strings.ListItemCommentDIalogDeleteSubText
};


export const ConfirmDelete: React.FunctionComponent<IConfirmDeleteProps> = (props: IConfirmDeleteProps) =>
{
	const { hideDialog, onDismiss } = props;
	const { listItemCommentsState: { selectedComment } } = React.useContext(ListItemCommentsStateContext);
	const { documentCardDeleteStyles, itemContainerStyles } = useListItemCommentsStyles();

	const onCanceled = React.useCallback(() => onDismiss(false), [onDismiss]);
	const onConfirmed = React.useCallback(() => onDismiss(true), [onDismiss]);

	if (!selectedComment)
		return null;

	return (<Dialog
		hidden={hideDialog}
		onDismiss={onCanceled}
		dialogContentProps={dialogContentProps}
		modalProps={modelProps}
	>
		{" "}
		<DocumentCard styles={documentCardDeleteStyles}>
			<DocumentCardDetails styles={{ root: { paddingTop: 15 } }}>
				<Stack
					horizontal
					horizontalAlign="start"
					verticalAlign="center"
					tokens={{ childrenGap: 12 }}
					styles={itemContainerStyles}
				>
					<CommentItem comment={selectedComment} />
				</Stack>
			</DocumentCardDetails>
		</DocumentCard>
		<DialogFooter>
			<PrimaryButton onClick={onConfirmed} text="OK" />
			<DefaultButton onClick={onCanceled} text="Cancel" />
		</DialogFooter>
	</Dialog>);
};
