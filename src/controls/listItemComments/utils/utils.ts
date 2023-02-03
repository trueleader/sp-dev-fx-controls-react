import { SPComponentLoader } from "@microsoft/sp-loader";

const DEFAULT_PERSONA_IMG_HASH = "7ad602295f8386b7615b582d87bcc294";
const DEFAULT_IMAGE_PLACEHOLDER_HASH = "4a48f26592f4e1498d7a478a4c48609c";
const MD5_MODULE_ID = "8494e7d7-6b99-47b2-a741-59873e42f16f";
const PROFILE_IMAGE_URL = "/_layouts/15/userphoto.aspx?size=M&accountname=";

export function getScrollPosition(_dataListContainerRef: { scrollTop: number, scrollHeight: number, clientHeight: number; }): number
{
	const { scrollTop, scrollHeight, clientHeight } = _dataListContainerRef;
	const percentNow = (scrollTop / (scrollHeight - clientHeight)) * 100;
	return percentNow;
}

export function b64toBlob(b64Data: string, contentType: string, sliceSize?: number): Promise<Blob>
{
	contentType = contentType || "image/png";
	sliceSize = sliceSize ? sliceSize : 512;

	const byteCharacters: string = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize)
	{
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++)
		{
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	const blob = new Blob(byteArrays, { type: contentType });
	return Promise.resolve(blob);
}

export function blobToBase64(blob: Blob): Promise<string>
{
	return new Promise((resolve, reject) =>
	{
		const reader = new FileReader();
		reader.onerror = reject;
		reader.onload = () => resolve(reader.result as string);
		reader.readAsDataURL(blob);
	});
}

export function getImageBase64(pictureUrl: string): Promise<string>
{
	return new Promise((resolve, reject) =>
	{
		const image = new Image();
		image.addEventListener("load", () =>
		{
			const tempCanvas = document.createElement("canvas");
			tempCanvas.width = image.width;
			tempCanvas.height = image.height;
			tempCanvas.getContext("2d")?.drawImage(image, 0, 0);
			let base64Str;
			try
			{
				base64Str = tempCanvas.toDataURL("image/png");
			}
			catch (e)
			{
				reject(e);
				return;
			}

			base64Str = base64Str.replace(/^data:image\/png;base64,/, "");
			resolve(base64Str);
		});
		image.src = pictureUrl;
	});
}



/**
 * Load SPFx component by id, SPComponentLoader is used to load the SPFx components
 * @param componentId - componentId, guid of the component library
 */
export async function loadSPComponentById(componentId: string): Promise<unknown | undefined>
{
	try
	{
		return await SPComponentLoader.loadComponentById(componentId);
	}
	catch
	{
		// eslint-disable-next-line consistent-return
		return undefined;
	}
}

/**
 * Get MD5Hash for the image url to verify whether user has default image or custom image
 * @param url
 */
export async function getMd5HashForUrl(url: string): Promise<string>
{
	const library = await loadSPComponentById(MD5_MODULE_ID) as { Md5Hash?: (value: string) => string; } | undefined;
	try
	{
		return library?.Md5Hash?.(url) ?? url;
	}
	catch (error)
	{
		return url;
	}
}

/**
 * Gets user photo
 * @param userId
 * @returns user photo
 */
export async function getUserPhoto(userId: number): Promise<string | undefined>
{
	const personaImgUrl = `${PROFILE_IMAGE_URL}${userId}`;

	const url = await getImageBase64(personaImgUrl);
	const newHash = await getMd5HashForUrl(url);

	if (newHash !== DEFAULT_PERSONA_IMG_HASH && newHash !== DEFAULT_IMAGE_PLACEHOLDER_HASH)
		return "data:image/png;base64," + url;

	// eslint-disable-next-line consistent-return
	return undefined;
}
