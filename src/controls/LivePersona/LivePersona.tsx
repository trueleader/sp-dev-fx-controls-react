import type { ILivePersonatProps } from "./ILivePersonaProps";
import { Log } from "@microsoft/sp-core-library";
import { SPComponentLoader } from "@microsoft/sp-loader";
import React, { createElement, useEffect, useRef, useState } from "react";

const LIVE_PERSONA_COMPONENT_ID = "914330ee-2df2-4f6e-a858-30c23a812408";


export const LivePersona: React.FunctionComponent<ILivePersonatProps> = (props: ILivePersonatProps) =>
{
	const [isComponentLoaded, setIsComponentLoaded] = useState<boolean>(false);
	const sharedLibrary = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
	const { upn, template, disableHover, serviceScope } = props;

	useEffect(
		() =>
		{
			if (isComponentLoaded) return;

			SPComponentLoader.loadComponentById(LIVE_PERSONA_COMPONENT_ID)
				.then((component) => { sharedLibrary.current = component; setIsComponentLoaded(true); })
				.catch((e: Error) => Log.error(`[LivePersona]`, e, serviceScope));
		},
		[isComponentLoaded, serviceScope]
	);


	if (!isComponentLoaded || !sharedLibrary.current)
		return null;

	return createElement(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		sharedLibrary.current.LivePersonaCard,
		{
			className: "livePersonaCard",
			clientScenario: "livePersonaCard",
			disableHover: disableHover,
			hostAppPersonaInfo: {
				PersonaType: "User"
			},
			upn: upn,
			legacyUpn: upn,
			serviceScope: serviceScope
		},
		createElement("div", {}, template)
	);
};
