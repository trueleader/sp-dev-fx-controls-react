import he from "he";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import React from "react";
import regexifyString from "regexify-string";

import type { Mention } from "./IComment";
import { AppContext } from "../../common";
import { useTheme } from "../../hooks/useTheme";
import { LivePersona } from "../../../LivePersona";

export interface ICommentTextProps
{
	text: string;
	mentions: Array<Mention>;
}

export const CommentText: React.FunctionComponent<ICommentTextProps> = (props: ICommentTextProps) =>
{
	const { text, mentions } = props;

	const appCtx = React.useContext(AppContext);
	if (!appCtx)
		throw new Error("No wrapping AppContext.Provider called");

	const theme = useTheme();

	const { serviceScope } = appCtx;

	const commentText = React.useMemo(
		(): string | Array<JSX.Element> =>
		{
			if (!mentions.length)
				return text;

			return regexifyString({
				pattern: /@mention&#123;\d+&#125;/g,
				decorator: (match, index) =>
				{
					const { name, email } = mentions[index];
					return (
						<LivePersona
							/* source and targe ServiceScope should come frome within the same library */
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
							serviceScope={serviceScope as any}
							upn={email}
							template={<span style={{ color: theme.themePrimary, whiteSpace: "nowrap" }}>@{name}</span>}
						/>
					);
				},
				input: text
			}) as Array<JSX.Element>;
		},
		[mentions, serviceScope, text, theme]
	);

	return (
		<Stack wrap horizontal horizontalAlign="start" verticalAlign="center">
			{Array.isArray(commentText)
				? commentText.map((el, i) => (<span key={i} style={{ paddingRight: 5 }}>{el}</span>))
				: (<Text variant="small">{he.decode(commentText)}</Text>)}
		</Stack>
	);
};
