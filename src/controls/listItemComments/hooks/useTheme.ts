import type { IPalette } from "@microsoft/sp-component-base";
import { ThemeProvider } from "@microsoft/sp-component-base";
import React from "react";
import "spfx-uifabric-themes";

import { AppContext } from "../common";


export function useTheme(): Partial<IPalette>
{
	const appCtx = React.useContext(AppContext);
	if (!appCtx)
		throw new Error("No wrapping AppContext.Provider called");

	const { serviceScope } = appCtx;

	const [theme, setTheme] = React.useState<Partial<IPalette>>(window.__themeState__.theme);

	React.useEffect(
		() =>
		{
			serviceScope.whenFinished(() =>
			{
				const spTheme = serviceScope.consume(ThemeProvider.serviceKey).tryGetTheme();
				setTheme(spTheme?.palette ?? window.__themeState__.theme);
			});
		},
		[serviceScope]
	);

	return theme;
}
