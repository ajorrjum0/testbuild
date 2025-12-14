import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const TOKEN_CONTRACT = (import.meta.env.VITE_TOKEN_CONTRACT ?? "").trim();

if (!TOKEN_CONTRACT) {
  console.warn("VITE_TOKEN_CONTRACT not set — TokenPrice will not fetch data until a contract is provided.");
}

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
    if (!TOKEN_CONTRACT) return { price: null, change24h: null, source: null };

    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_CONTRACT}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

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
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      const result = await fetchPriceAndChange();
      
      // Immediately update price and related state
      const priceChanged = prevPrice === null || result.price !== prevPrice;

      if (mounted) {
        setPrice(result.price ?? null);
        setChange24h(result.change24h ?? null);
        setPriceSource(result.source ?? null);
        if (priceChanged) {
          setPrevPrice(result.price ?? null);
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
      <div>
        <div className="flex flex-row items-center gap-2 whitespace-nowrap">
          {showPrice ? (
            <span className="text-2xl font-bold text-white">$ {formatUSD(price)}</span>
          ) : null}
          {showTrend ? (
            <TokenTrendBadge className="text-sm font-bold inline-flex items-center" />
          ) : null}
        </div>
        {priceSource && priceSource !== "Dexscreener" ? (
          <div className="text-sm text-slate-400">Source: <span className="text-gray-400 font-medium">{priceSource}</span></div>
        ) : null}
      </div>
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
