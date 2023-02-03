export interface IApiCollectionResult<T>
{
	"@odata.nextLink"?: string;
	value: Array<T>;
}
