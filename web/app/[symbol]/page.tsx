import { getClient } from "@/utils/client";
import { gql } from "@apollo/client";
import StockChart from "../../components/stock-chart";
import Search from "@/components/search";
import QuarterReport from "@/components/quarter-report";

interface Quarter {
  quarter: string;
  high: {
    date: string;
    price: number;
    volume: number;
  };
  low: {
    date: string;
    price: number;
    volume: number;
  };
}

async function QuarterAnalytic({
  symbol,
  fromYear,
}: {
  symbol: string;
  fromYear: string;
}) {
  const query = gql`
    query {
      quarterHistories(fromYear: ${fromYear}, symbol: "${symbol}") {
        averageSupport
        averageResistance
        quarters {
          quarter
          high {
            date
            price
            volume
          }
          low {
            date
            price
            volume
          }
        }
      }
    }
  `;

  const {
    data,
  }: {
    data: {
      quarterHistories: {
        averageResistance: number;
        averageSupport: number;
        quarters: Quarter[];
      };
    };
  } = await getClient().query({
    query,
    context: {
      fetchOptions: {
        next: { revalidate: 50 },
      },
    },
  });

  const labels = data.quarterHistories.quarters.map((i) => i.quarter);
  const supports = data.quarterHistories.quarters.map((i) => i.low.price);
  const resistances = data.quarterHistories.quarters.map((i) => i.high.price);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <div>
      <div>
        <Search defaultYear={Number(fromYear)} defaultSymbol={symbol} />
      </div>
      <p>
        Average Resistance:{" "}
        {formatter.format(data.quarterHistories.averageResistance)}
      </p>
      <p>
        Average Support:{" "}
        {formatter.format(data.quarterHistories.averageSupport)}
      </p>

      <div className="my-3">
        <QuarterReport symbol={symbol} />
      </div>

      <div className="flex justify-center gap-7">
        <div className="flex gap-1 items-center">
          <div className="rounded-full w-5 h-5 bg-teal-300 border border-black" />
          <span>Resistance</span>
        </div>
        <div className="flex gap-1 items-center">
          <div className="rounded-full w-5 h-5 bg-pink-300 border border-black" />
          <span>Support</span>
        </div>
      </div>
      <StockChart
        labels={labels}
        datasets={[
          { data: supports, borderColor: "lightPink" },
          { data: resistances, borderColor: "aquamarine" },
        ]}
      />
    </div>
  );
}

async function FundamentalAnalytic({ symbol }: { symbol: string }) {
  const query = gql`
    query {
      fundamentalAnalytic(symbol: "${symbol}"){
        statistic{
          label,
          value
        },
        recommendation{
          title,
          body,
          url
        }
      }
    }
  `;

  const {
    data,
  }: {
    data: {
      fundamentalAnalytic: {
        statistic: { label: string; value: string }[];
        recommendation: { title: string; body: string; url: string }[];
      };
    };
  } = await getClient().query({
    query,
    context: {
      fetchOptions: {
        next: { revalidate: 50 },
      },
    },
  });

  return (
    <div>
      <div className="pt-12">
        <p className="text-lg font-medium pb-2">Statistic :</p>
        <div className="flex justify-between w-full flex-wrap">
          {data.fundamentalAnalytic.statistic.map((s) => (
            <div className="w-1/3" key={s.label}>
              <p>
                <span className="font-medium w-[30%]">{s.label}</span>:{" "}
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-lg font-medium pt-12 pb-2">Recommendations :</p>
      <div className="overflow-auto">
        <div className="flex justify-between w-[80vw] gap-3">
          {data.fundamentalAnalytic.recommendation.map((s, i) => (
            <div className="w-72">
              <a href={s.url} target="_blank" className="py-3" key={i}>
                <p className="pb-1 font-medium ">{s.title}</p>
                <p className="w-72">{s.body}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function DetailAnalytic({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams?: { [key: string]: string };
}) {
  return (
    <main>
      <QuarterAnalytic
        symbol={params.symbol}
        fromYear={searchParams!.fromYear}
      />
      <FundamentalAnalytic symbol={params.symbol} />
    </main>
  );
}
