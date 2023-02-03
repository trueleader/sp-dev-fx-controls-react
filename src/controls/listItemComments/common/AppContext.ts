import * as React from "react";

import type { IAppContext } from "./IAppContext";

export const AppContext = React.createContext<IAppContext | undefined>(undefined);
