import { getClient } from "@/utils/client";
import { gql } from "@apollo/client";
import StockChart from "../../components/stock-chart";
import { useParams } from "next/navigation";

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

export default async function DetailAnalytic({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = gql`
    query {
      quarterHistories(fromYear: ${searchParams?.fromYear}, symbol: "${params.symbol}") {
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

  return (
    <main>
      <p>
        {params.symbol}, {searchParams?.fromYear}
      </p>
      <StockChart
        labels={labels}
        datasets={[
          { data: supports, borderColor: "red" },
          { data: resistances, borderColor: "green" },
        ]}
      />
    </main>
  );
}
