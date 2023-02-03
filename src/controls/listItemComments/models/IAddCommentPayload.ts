export interface IAddCommentPayload
{
	text: string;
	mentions: Array<IAddMention>;
}
interface IAddMention
{
	email: string;
	name: string;
}
