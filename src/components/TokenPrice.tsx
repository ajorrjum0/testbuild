import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const TOKEN_CONTRACT = "0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59";

type FetchResult = {
  price?: number | null;
  change24h?: number | null;
  source?: string | null;
};

async function fetchPriceAndChange(): Promise<FetchResult> {
  // Simplified: use Dexscreener only
  let price: number | null = null;
  let change24h: number | null = null;
  let source: string | null = null;

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_CONTRACT}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    console.log("Dexscreener response:", json);

    const pair = (json.pairs?.[0]) || json.pair;
    if (pair) {
      const priceStr = pair.priceUsd || pair.price;
      if (priceStr) {
        price = parseFloat(priceStr);
        source = "Dexscreener";
      }
      change24h = pair.priceChange?.h24 || pair.priceChangeH24 || null;
    }
  } catch (err) {
    console.error("Dexscreener fetch failed:", err);
  }

  return { price, change24h, source };
}

export default function TokenPrice({ className, showPrice = false, showTrend = true }: { className?: string; showPrice?: boolean; showTrend?: boolean }) {
  const [price, setPrice] = useState<number | null>(null);
  const [, setChange24h] = useState<number | null>(null);
  const [priceSource, setPriceSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      const result = await fetchPriceAndChange();
      
      // Only show loading if price changed or first load
      const priceChanged = prevPrice === null || result.price !== prevPrice;
      
      if (priceChanged) {
        setLoading(true);
        // Add minimum 1 second delay to show loading state only if price changed
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      if (mounted) {
        setPrice(result.price ?? null);
        setChange24h(result.change24h ?? null);
        setPriceSource(result.source ?? null);
        if (priceChanged) {
          setPrevPrice(result.price ?? null);
          setLoading(false);
        }
      }
    };

    fetchPrice();
    const iv = setInterval(fetchPrice, 10000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [prevPrice]);

  const formatUSD = (p: number | null) => {
    if (p === null || Number.isNaN(p)) return "0.000";
    return p.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 6 });
  };

  return (
    <div className={className}>
      {loading ? (
        <div>
          <span className="text-gray-300 font-medium">Loading...</span>
        </div>
      ) : (
        <div>
          <div className="flex flex-row items-center gap-2 whitespace-nowrap">
            {showPrice ? (
              <span className="text-2xl font-bold text-cyan-400">$ {formatUSD(price)}</span>
            ) : null}
            {showTrend ? (
              <TokenTrendBadge className="text-sm font-bold inline-flex items-center" />
            ) : null}
          </div>
          {priceSource && priceSource !== "Dexscreener" ? (
            <div className="text-sm text-slate-400">Source: <span className="text-cyan-300 font-medium">{priceSource}</span></div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function TokenTrendBadge({ className }: { className?: string }) {
  const [change24, setChange24] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchChange = async () => {
      const result = await fetchPriceAndChange();
      if (mounted) {
        setChange24(result.change24h ?? null);
      }
    };

    fetchChange();
    const iv = setInterval(fetchChange, 10000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  const isPositive = (change24 ?? 0) >= 0;
  return (
    <span className={`${className} inline-flex items-center gap-1 text-sm font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
      {isPositive ? <TrendingUp className="w-4 h-4 stroke-current" /> : <TrendingDown className="w-4 h-4 stroke-current" />}
      {change24 !== null ? `${isPositive ? "+" : ""}${change24.toFixed(2)}%` : "—"}
    </span>
  );
}
