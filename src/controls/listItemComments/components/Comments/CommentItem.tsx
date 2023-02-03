import React, { useMemo } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { ActivityItem } from "@fluentui/react/lib/ActivityItem";
import { Text } from "@fluentui/react/lib/Text";
import { Stack } from "@fluentui/react/lib/Stack";
import { IComment } from "./IComment";
import { CommentText } from "./CommentText";
import { isEmpty } from "lodash";

const PHOTO_URL = "/_layouts/15/userphoto.aspx?size=M&accountname=";

export interface IRenderNotificationItemProps
{
	comment: IComment;
}

export const CommentItem: React.FunctionComponent<IRenderNotificationItemProps> = (props: IRenderNotificationItemProps) =>
{
	const { author, createdDate, text, mentions } = props.comment;

	const activityDescription = useMemo(
		(): React.ReactElement =>
		{
			return (<>
				<Text variant="smallPlus" styles={{ root: { fontWeight: 700 } }}>
					{author.name}
				</Text>
				<CommentText text={text} mentions={mentions} />
			</>);
		},
		[author.name, mentions, text]
	);

	if (isEmpty(props.comment))
		return null;

	return (
		<>
			<Stack>
				<ActivityItem
					activityPersonas={[{ imageUrl: `${PHOTO_URL}${author.email}` }]}
					activityDescription={activityDescription}
					timeStamp={format(parseISO(createdDate), "PPpp")}
				/>
			</Stack>
		</>
	);
};
