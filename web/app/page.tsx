import { getClient } from "@/utils/client";
import { gql } from "@apollo/client";
import StockChart from "../components/stock-chart";

const query = gql`
  query {
    quarterHistories(fromYear: 2020, symbol: "ASII") {
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

export default async function Page() {
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
      <StockChart
        labels={labels}
        datasets={[
          { data: supports, backgroundColor: "red" },
          { data: resistances, backgroundColor: "green" },
        ]}
      />
    </main>
  );
}
