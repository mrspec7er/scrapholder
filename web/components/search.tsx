"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = ({
  defaultYear,
  defaultSymbol,
}: {
  defaultYear: number;
  defaultSymbol?: string;
}) => {
  const [symbol, setSymbol] = useState(defaultSymbol ?? "");
  const [fromYear, setFromYear] = useState(defaultYear);

  const router = useRouter();
  return (
    <div className="py-5 flex flex-col md:flex-row gap-2">
      <input
        defaultValue={defaultSymbol}
        className="border-2 border-gray-200 rounded"
        onChange={(e) => setSymbol(e.target.value)}
        type="text"
      />
      <input
        className="border-2 border-gray-200 rounded"
        onChange={(e) => setFromYear(Number(e.target.value))}
        defaultValue={defaultYear}
        type="number"
      />
      <button
        type="button"
        onClick={() => router.push(`/${symbol}?fromYear=${fromYear}`)}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
