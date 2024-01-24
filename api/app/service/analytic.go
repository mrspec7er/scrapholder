package service

import (
	"sort"
	"sync"
	"time"

	"github.com/mrspec7er/scrapholder/app/dto"
)

type AnalyticService struct {
	Utils UtilService
}

func (s AnalyticService) GetQuarterAnalytic(symbol string, fromYear int) (dto.StockQuarterHistories, error) {
	quarters := []*dto.QuarterHistory{}

	ctx := make(chan []*dto.QuarterHistory, (time.Now().Year())-fromYear+1)
	wg := &sync.WaitGroup{}
	wg.Add(time.Now().Year() - fromYear + 1)

	for i := fromYear; i <= time.Now().Year(); i++ {
		go s.Utils.GetQuarterHistories(symbol, i, ctx, wg)
	}

	wg.Wait()
	close(ctx)

	for quarter := range ctx {
		quarters = append(quarters, quarter...)
	}

	if len(quarters) == 0 {
		return dto.StockQuarterHistories{AverageResistance: 0, AverageSupport: 0, Quarters: []*dto.QuarterHistory{}}, nil
	}

	sort.Slice(quarters, func(i, j int) bool {
		return quarters[i].Quarter < quarters[j].Quarter
	})

	averageSupport := 0
	averageResistance := 0
	for _, q := range quarters {
		averageSupport = averageSupport + q.Low.Price
		averageResistance = averageResistance + q.High.Price
	}

	return dto.StockQuarterHistories{AverageResistance: averageResistance / len(quarters), AverageSupport: averageSupport / len(quarters), Quarters: quarters}, nil
}

func (s AnalyticService) GetFundamentalAnalytic(symbol string) (*dto.FundamentalAnalysis, error) {
	statistic, recommendation, err := s.Utils.InformationScrapper(symbol)

	return &dto.FundamentalAnalysis{
		Statistic:      statistic,
		Recommendation: recommendation,
	}, err
}
