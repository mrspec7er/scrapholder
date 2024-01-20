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

      <QuarterReport symbol={symbol} />
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
        <p className="text-lg font-semibold">Statistic :</p>
        {data.fundamentalAnalytic.statistic.map((s) => (
          <div className="py-1" key={s.label}>
            <p>
              <span className="font-medium">{s.label}</span>: {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="pt-12">
        <p className="text-lg font-semibold">Recommendations :</p>

        {data.fundamentalAnalytic.recommendation.map((s, i) => (
          <a href={s.url} target="_blank" className="py-3" key={i}>
            <p className="pb-1 font-medium">{s.title}</p>
            <p>{s.body}</p>
          </a>
        ))}
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
