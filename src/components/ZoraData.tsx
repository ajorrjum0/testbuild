import { useEffect, useState } from "react";

export default function ZoraData() {
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    // Placeholder: replace with real Zora API integration later
    setItems([]);
  }, []);

  return (
    <div className="text-left">
      <p className="text-slate-400 text-sm mb-1">Zora Data</p>
      {items === null ? (
        <p className="text-white">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-white">No data available</p>
      ) : (
        <ul className="text-white">
          {items.map((it, i) => (
            <li key={i}>{String(it)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
