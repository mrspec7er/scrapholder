import { getClient } from "@/utils/client";
import { gql } from "@apollo/client";
import StockChart from "./stock-chart";

const query = gql`
  query {
    stockHistories(
      symbol: "AUTO"
      fromDate: "2022-01-02"
      toDate: "2023-01-01"
    ) {
      symbol
      date
      open
      close
      high
      low
      volume
    }
  }
`;

interface Histories {
  symbol: string;
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export default async function Page() {
  const { data }: { data: { stockHistories: Histories[] } } =
    await getClient().query({
      query,
      context: {
        fetchOptions: {
          next: { revalidate: 50 },
        },
      },
    });

  const labels = data.stockHistories.map((i) => i.date);
  const closePrices = data.stockHistories.map((i) => i.close);

  return (
    <main>
      <StockChart
        labels={labels}
        datasets={[{ data: closePrices, borderColor: "blue" }]}
      />
    </main>
  );
}
