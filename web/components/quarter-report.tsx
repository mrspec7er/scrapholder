"use client";

import { decimalConverter } from "@/utils/decimal-converter";
import { useState } from "react";

const QuarterReport = ({ symbol }: { symbol: string }) => {
  const [quarter, setQuarter] = useState("I");
  const [year, setYear] = useState("2023");

  return (
    <div className="py-2">
      <div className="flex gap-5">
        <label htmlFor="year">Select Year</label>
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

const QuarterReportModal = ({ symbol }: { symbol: string }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      {openModal ? (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="flex justify-center w-full h-full items-center bg-black bg-opacity-30">
            <div className="h-[30vh] min-w-[30vw] bg-slate-100 p-5">
              <QuarterReport symbol={symbol} />
              <button
                type="button"
                className="text-black"
                onClick={() => setOpenModal(false)}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        Download Report
      </button>
    </>
  );
};

export default QuarterReportModal;
