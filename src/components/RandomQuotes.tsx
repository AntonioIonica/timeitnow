"use client";

import { useEffect, useState } from "react";

// default quote until fetching from the endpoint
const defaultQuote = [
  {
    q: "Small progress is still progress!",
    a: "Anonymous",
  },
];

function RandomQuotes() {
  const [quote, setQuote] = useState<Record<string, string>>(defaultQuote[0]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/quotes");
      if (res.ok) {
        const data = await res.json();
        setQuote(data[0]);
      } else {
        console.error("Failed to fetch quote from API route");
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <q className="text-md text-center font-bold italic text-slate-100 md:text-lg">
        {quote.q}
      </q>
      <div className="flex flex-row-reverse text-sm font-bold text-slate-100">
        {quote.a}
      </div>
    </>
  );
}
export default RandomQuotes;
