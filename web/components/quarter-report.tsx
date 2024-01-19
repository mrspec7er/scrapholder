"use client";

import { decimalConverter } from "@/utils/decimal-converter";
import { useState } from "react";

const QuarterReport = ({ symbol }: { symbol: string }) => {
  const [quarter, setQuarter] = useState("I");
  const [year, setYear] = useState("2023");

  return (
    <div className="py-2">
      <div className="flex gap-5">
        <label htmlFor="year">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="flex gap-5">
        <label htmlFor="year">Select Quarter</label>
        <select onChange={(e) => setQuarter(e.target.value)}>
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="ANNUAL">Annual</option>
        </select>
      </div>
      <div className="bg-green-500 w-fit px-2 py-1 my-2 rounded text-white font-semibold">
        {quarter != "ANNUAL" ? (
          <a
            href={`https://idx.co.id/Portals/0/StaticData/ListedCompanies/Corporate_Actions/New_Info_JSX/Jenis_Informasi/01_Laporan_Keuangan/02_Soft_Copy_Laporan_Keuangan//Laporan%20Keuangan%20Tahun%20${year}/TW${decimalConverter(
              quarter
            )}/${symbol}/FinancialStatement-${year}-${quarter}-${symbol}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Quarter Report
          </a>
        ) : (
          <a
            href={`https://idx.co.id/Portals/0/StaticData/ListedCompanies/Corporate_Actions/New_Info_JSX/Jenis_Informasi/01_Laporan_Keuangan/02_Soft_Copy_Laporan_Keuangan//Laporan%20Keuangan%20Tahun%20${year}/Audit/${symbol}/FinancialStatement-${year}-Tahunan-${symbol}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Annual Report
          </a>
        )}
      </div>
    </div>
  );
};

export default QuarterReport;
