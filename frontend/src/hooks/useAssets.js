import { useEffect, useState } from "react";
import { getAssets } from "../services/api";

// Module-level cache: the assets list is fetched once per app lifetime,
// no matter how many times the consuming component mounts.
let assetsCache = null;

export const useAssets = () => {
  const [assets, setAssets] = useState(assetsCache ?? []);

  useEffect(() => {
    if (assetsCache) return;
    getAssets()
      .then((data) => {
        assetsCache = data.results;
        setAssets(assetsCache);
      })
      .catch((err) => console.error("Failed to load assets", err));
  }, []);

  return assets;
};
