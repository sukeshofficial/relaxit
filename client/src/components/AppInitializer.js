import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import logoAsset from "../assets/wordmark.svg";
import { hydrateAuthSession } from "../store/hydrateAuth";
export default function AppInitializer({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const initApp = async () => {
            try {
                await hydrateAuthSession();
            }
            catch (error) {
                console.error("Startup initialization error:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        initApp();
    }, []);
    if (isLoading) {
        return _jsx(LoadingScreen, { logoUrl: logoAsset });
    }
    return _jsx(_Fragment, { children: children });
}
