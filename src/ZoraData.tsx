import React, { useEffect, useState } from "react";

const TOKEN_CONTRACT = "0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59";

const ZoraData: React.FC<{ inline?: boolean }> = ({ inline = false }) => {
  const [fdv, setFdv] = useState<number | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [prevFdv, setPrevFdv] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFdv = async () => {
      try {
        // Only show loading if FDV might change
        const shouldShowLoading = prevFdv === null; // First load or FDV changed
        if (shouldShowLoading) {
          setLoadingPrice(true);
        }

        // Only add delay if showing loading state
        if (shouldShowLoading) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // Fetch FDV from Dexscreener
        console.log("Fetching FDV from Dexscreener...");
        try {
          const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_CONTRACT}`, {
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok) {
            const json = await res.json();
            const pair = json.pairs?.[0] || json.pair;
            const dexFdv = pair?.fdv || null;
            if (mounted) {
              const changed = dexFdv !== prevFdv;
              setFdv(dexFdv);
              setSource(dexFdv ? "Dexscreener" : null);
              if (changed) {
                setPrevFdv(dexFdv);
                setLoadingPrice(false);
              }
            }
            console.log("Dexscreener FDV:", dexFdv);
          }
        } catch (err) {
          console.error("Dexscreener FDV fetch failed:", err);
          if (mounted) {
            setFdv(null);
            setSource(null);
            setLoadingPrice(false);
          }
        }
      } catch (err) {
        console.error("Error fetching FDV:", err);
        if (mounted) {
          setFdv(null);
          setLoadingPrice(false);
        }
      }
    };

    fetchFdv();
    const iv = setInterval(fetchFdv, 15000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [prevFdv]);

  const formatFdv = (f: number | null) => {
    if (f === null || Number.isNaN(f)) return "—";
    if (f >= 1e9) return (f / 1e9).toFixed(1) + "B";
    if (f >= 1e6) return (f / 1e6).toFixed(1) + "M";
    if (f >= 1e3) return (f / 1e3).toFixed(1) + "K";
    return f.toFixed(2);
  };

  return inline ? (
    <span className="text-cyan-400 font-semibold">
      {loadingPrice ? "Loading..." : formatFdv(fdv)}
      {!loadingPrice && source && source !== "Dexscreener" ? <span className="text-sm text-slate-400 ml-2">(source: {source})</span> : null}
    </span>
  ) : (
    <div className="text-left text-white mt-6">
      <h3 className="text-lg text-slate-400">
        FDV: <span className="text-cyan-400 font-semibold">{loadingPrice ? "Loading..." : formatFdv(fdv)}</span>
      </h3>
      {source && source !== "Dexscreener" ? (
        <p className="text-sm text-slate-400 mt-1">Source: <span className="text-cyan-300 font-medium">{source}</span></p>
      ) : null}
    </div>
  );
};

export default ZoraData;
