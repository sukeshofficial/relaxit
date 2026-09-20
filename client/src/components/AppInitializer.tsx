import { useState, useEffect, type ReactNode } from "react";

import LoadingScreen from "./LoadingScreen";
import logoAsset from "../assets/wordmark.svg";
import { hydrateAuthSession } from "../store/hydrateAuth";

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await hydrateAuthSession();
      } catch (error) {
        console.error("Startup initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen logoUrl={logoAsset} />;
  }

  return <>{children}</>;
}
