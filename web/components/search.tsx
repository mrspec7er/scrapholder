"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
  const [symbol, setSymbol] = useState("");

  const router = useRouter();
  return (
    <div>
      <input onChange={(e) => setSymbol(e.target.value)} type="text" />
      <button
        type="button"
        onClick={() => router.push(`/${symbol}?fromYear=2023`)}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
