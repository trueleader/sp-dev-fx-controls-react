import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Stack } from "@fluentui/react/lib/Stack";
import * as React from "react";

export interface IErrorInfoProps
{
	error: Error;
	showError: boolean;
	showStack?: boolean;
}

export const ErrorInfo: React.FunctionComponent<IErrorInfoProps> = (props: IErrorInfoProps) =>
{
	const { error, showStack, showError } = props;

	if (!showError)
		return null;

	return (
		<Stack tokens={{ padding: 10, childrenGap: 10 }}>
			<MessageBar messageBarType={MessageBarType.error} isMultiline>
				{error.message}
				{showStack ? error.stack : ""}
			</MessageBar>
		</Stack>
	);
};
