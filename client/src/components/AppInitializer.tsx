import { useState, useEffect, type ReactNode } from "react";

import LoadingScreen from "./LoadingScreen";
import logoAsset from "../assets/wordmark.svg"

interface AppInitializerProps {
  children: ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        // Centralized bootup API requests go here
        await new Promise((resolve) => setTimeout(resolve, 2500));
        // await new Promise(() => {});
      } catch (error) {
        console.error("Failed to load account data during startup:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, []);

  if (isLoading) {
    return <LoadingScreen logoUrl={logoAsset} />;
  }

  return <>{ children }</>
}