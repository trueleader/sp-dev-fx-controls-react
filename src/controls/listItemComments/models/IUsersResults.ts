export interface IUsersResults
{
	users: Array<IUserInfo>;
	hasMore?: boolean;
	nextLink?: string;
}
export interface IUserInfo
{
	displayName: string;
	givenName?: string;
	mail: string;
	userPrincipalName?: string;
	id: string;
}
