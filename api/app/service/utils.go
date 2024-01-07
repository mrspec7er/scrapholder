package service

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"slices"

	"github.com/gocolly/colly"
	"github.com/mrspec7er/scrapholder/app/dto"
	"github.com/mrspec7er/scrapholder/app/repository"
)

type UtilService struct {
	Redis repository.Redis
}

func (UtilService) InformationScrapper(symbol string) ([]*dto.Statistic, []*dto.Recommendation, error) {
	c := colly.NewCollector(
		colly.AllowedDomains("id.tradingview.com"),
	)

	statistic := []*dto.Statistic{}

	c.OnHTML(".block-GgmpMpKr", func(e *colly.HTMLElement) {

		label := e.DOM.Find(".label-GgmpMpKr").Text()
		value := e.DOM.Find(".value-GgmpMpKr").Contents().Not(".measureUnit-lQwbiR8R").Text()

		statistic = append(statistic, &dto.Statistic{Label: label, Value: value})

	})

	var recommendation []*dto.Recommendation

	c.OnHTML(".card-exterior-Us1ZHpvJ", func(e *colly.HTMLElement) {

		title := e.DOM.Find(".title-tkslJwxl").Text()
		body := e.DOM.Find(".line-clamp-content-t3qFZvNN").Text()

		recommendation = append(recommendation, &dto.Recommendation{Title: title, Body: body})
	})

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
		fmt.Println("Visiting", r.URL.String())
	})

	err := c.Visit("https://id.tradingview.com/symbols/IDX-" + symbol + "/")
	if err != nil {
		return nil, nil, err
	}

	return statistic, recommendation, nil
}

func (u UtilService) GetStockHistory(symbol string, fromDate string, toDate string) ([]*dto.StockHistory, error) {
	key := symbol + "-" + fromDate + "-" + toDate
	result := []*dto.StockHistory{}
	err := u.Redis.Retrieve(key, &result)

	if err != nil {
		result, err = u.GoApiFetchData(symbol, fromDate, toDate)

		if len(result) == 0 || err != nil {
			return nil, err
		}

		err := u.Redis.CacheHistory(key, result)
		if err != nil {
			fmt.Println(err)
		}
	}

	slices.Reverse(result)

	return result, nil
}

func (u UtilService) GoApiFetchData(symbol string, fromDate string, toDate string) ([]*dto.StockHistory, error) {
	res, err := http.Get("https://api.goapi.io/stock/idx/" + symbol + "/historical?from=" + fromDate + "&to=" + toDate + "&api_key=cd818a59-52d0-51cd-bd66-fa8c6e45")
	fmt.Println("https://api.goapi.io/stock/idx/" + symbol + "/historical?from=" + fromDate + "&to=" + toDate + "&api_key=cd818a59-52d0-51cd-bd66-fa8c6e45")

	if err != nil {
		return nil, err
	}

	streamData, err := io.ReadAll(res.Body)

	if err != nil {
		return nil, err
	}

	convertedData := dto.StockHistoryApiResponse{}
	err = json.Unmarshal(streamData, &convertedData)
	if err != nil {
		return nil, err
	}

	return convertedData.Data.Results, nil
}
