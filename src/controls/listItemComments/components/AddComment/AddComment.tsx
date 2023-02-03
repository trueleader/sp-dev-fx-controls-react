import { IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MentionsInput, Mention, SuggestionDataItem, MentionItem } from "react-mentions";
import React, { useCallback, useContext, useRef, useState } from "react";

import type { IAddCommentPayload } from "../../models/IAddCommentPayload";
import { PHOTO_URL } from "../../common/constants";
import { ECommentAction } from "../../common/ECommentAction";
import { useMsGraphAPI } from "../../hooks/useMsGraphAPI";
import { EListItemCommentsStateTypes, ListItemCommentsStateContext } from "../ListItemCommentsStateProvider";
import { useAddCommentStyles } from "./useAddCommentStyles";


export const AddComment: React.FunctionComponent = () =>
{
	const [commentText, setCommentText] = useState<string>("");
	const { getUsers, getSuggestions } = useMsGraphAPI();
	const { reactMentionStyles, mentionsClasses, componentClasses } = useAddCommentStyles();
	const [singleLine, setSingleLine] = useState<boolean>(true);
	const { setListItemCommentsState } = useContext(ListItemCommentsStateContext);
	const _addCommentText = useRef<IAddCommentPayload>({ mentions: [], text: "" });

	const sugestionsContainer = useRef<HTMLDivElement | null>(null);

	const onChange = useCallback(
		(event, newValue: string, newPlainTextValue: string, mentions: Array<MentionItem>) =>
		{
			if (newValue)
			{
				setSingleLine(false);
				reactMentionStyles["&multiLine"].control = { height: 63 };
				_addCommentText.current.text = newPlainTextValue;
				_addCommentText.current.mentions = [];
				for (let index = 0; index < mentions.length; index++)
				{
					const mention = mentions[index];
					_addCommentText.current.text = _addCommentText.current.text.replace(mention.display, `@mention{${index}}`);
					_addCommentText.current.mentions.push({ email: mention.id, name: mention.display.replace("@", "") });
				}
			}
			else
			{
				setSingleLine(true);
				reactMentionStyles["&multiLine"].control = { height: 35 };
				_addCommentText.current = { mentions: [], text: "" };
			}

			setCommentText(newValue);
		},
		[reactMentionStyles]
	);

	const addComment = useCallback(
		() =>
		{
			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_COMMENT_ACTION, payload: ECommentAction.ADD });
			setListItemCommentsState({ type: EListItemCommentsStateTypes.SET_ADD_COMMENT, payload: _addCommentText.current });
			setSingleLine(true);
			setCommentText("");
		},
		[setListItemCommentsState]
	);

	const searchData = useCallback(
		(search: string, callback: (users: Array<SuggestionDataItem>) => void): void =>
		{
			// Try to get sugested users when user type '@'
			const promise = search ? getUsers(search) : getSuggestions();
			void promise.then(({ users }) => callback(users.map(u => ({ display: u.displayName, id: u.mail }))));
		},
		[getSuggestions, getUsers]
	);

	const renderSugestion = useCallback(
		(suggestion: SuggestionDataItem): React.ReactNode =>
		{
			const { id: mail, display } = suggestion;

			return (
				<Stack tokens={{ padding: 5 }} styles={{ root: { width: 260 } }}>
					<Stack horizontal horizontalAlign="start" tokens={{ childrenGap: 10 }}>
						<img src={`${PHOTO_URL}${mail}`} width={30} height={30} style={{ borderRadius: "50%" }} />
						<Stack>
							<Text styles={{ root: { fontWeight: 700 } }} variant="smallPlus" nowrap>
								{display}
							</Text>
							<Text variant="small" nowrap>
								{mail}
							</Text>
						</Stack>
					</Stack>
				</Stack>
			);
		},
		[]
	);


	return (
		<>
			{/* Render Sugestions in the host element */}
			<div id="renderSugestions" ref={sugestionsContainer} />
			<div className={componentClasses.container} style={{ height: singleLine ? 35 : "unset" }}>
				<MentionsInput
					value={commentText}
					onChange={onChange}
					placeholder="@mention or comment"
					style={reactMentionStyles}
					suggestionsPortalHost={sugestionsContainer.current ?? undefined}
				>
					<Mention
						trigger="@"
						data={searchData}
						renderSuggestion={renderSugestion}
						displayTransform={transformMentionsDisplayValue}
						className={mentionsClasses.mention}
					/>
				</MentionsInput>
				<Stack horizontal horizontalAlign="end" tokens={{ padding: 10 }}>
					<IconButton iconProps={{ iconName: "send" }} title="Send" onClick={addComment} />
				</Stack>
			</div>
		</>
	);
};



function transformMentionsDisplayValue(id: string, display: string): string
{
	return `@${display}`;
}

