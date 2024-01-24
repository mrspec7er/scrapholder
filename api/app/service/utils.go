package service

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"slices"
	"strconv"
	"sync"

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

		head := e.DOM.Find(".title-tkslJwxl")
		body := e.DOM.Find(".line-clamp-content-t3qFZvNN").Text()

		title := head.Text()
		url, exist := head.Attr("href")

		if exist {
			recommendation = append(recommendation, &dto.Recommendation{Title: title, Body: body, URL: url})
		}

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
	err := u.Redis.RetrieveHistories(key, &result)

	if err != nil {
		result, err = u.GoApiFetchData(symbol, fromDate, toDate)

		if len(result) == 0 || err != nil {
			return nil, err
		}

		err := u.Redis.CacheHistories(key, result)
		if err != nil {
			fmt.Println(err)
		}
	}

	slices.Reverse(result)

	return result, nil
}

func (u UtilService) GoApiFetchData(symbol string, fromDate string, toDate string) ([]*dto.StockHistory, error) {
	res, err := http.Get("https://api.goapi.io/stock/idx/" + symbol + "/historical?from=" + fromDate + "&to=" + toDate + "&api_key=" + os.Getenv("GOAPI_KEY"))
	fmt.Println("https://api.goapi.io/stock/idx/" + symbol + "/historical?from=" + fromDate + "&to=" + toDate + "&api_key=" + os.Getenv("GOAPI_KEY"))

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

func (s UtilService) GetQuarterHistories(symbol string, year int, ctx chan []*dto.QuarterHistory, wg *sync.WaitGroup) {
	quarters := []*dto.QuarterHistory{}
	histories, err := s.GetStockHistory(symbol, strconv.Itoa(year)+"-01-01", strconv.Itoa(year)+"-12-31")

	dataLength := len(histories)

	if err != nil {
		log.Println(err.Error())
		wg.Done()
		return
	}

	if dataLength < 61 {
		wg.Done()
		return
	}
	Q1Low, Q1High := s.GetQuarterSupportResistance(histories, 0, 62)
	quarters = append(quarters, &dto.QuarterHistory{Quarter: strconv.Itoa(year) + "-Q1", High: Q1High, Low: Q1Low})

	if dataLength < 124 {
		ctx <- quarters
		wg.Done()
		return
	}
	Q2Low, Q2High := s.GetQuarterSupportResistance(histories, 63, 124)
	quarters = append(quarters, &dto.QuarterHistory{Quarter: strconv.Itoa(year) + "-Q2", High: Q2High, Low: Q2Low})

	if dataLength < 188 {
		ctx <- quarters
		wg.Done()
		return
	}
	Q3Low, Q3High := s.GetQuarterSupportResistance(histories, 125, 188)
	quarters = append(quarters, &dto.QuarterHistory{Quarter: strconv.Itoa(year) + "-Q3", High: Q3High, Low: Q3Low})

	if dataLength < 238 {
		ctx <- quarters
		wg.Done()
		return
	}
	Q4Low, Q4High := s.GetQuarterSupportResistance(histories, 189, len(histories))
	quarters = append(quarters, &dto.QuarterHistory{Quarter: strconv.Itoa(year) + "-Q4", High: Q4High, Low: Q4Low})

	ctx <- quarters
	wg.Done()
	return
}

func (s UtilService) GetQuarterSupportResistance(histories []*dto.StockHistory, startRange int, endRange int) (support dto.QuarterDetail, resistance dto.QuarterDetail) {
	supportPrice := 9999999999
	supportDate := "2000-01-02"
	supportVolume := float64(0)

	resistancePrice := 0
	resistanceDate := "2000-01-02"
	resistanceVolume := float64(0)

	for _, h := range histories[startRange:endRange] {
		if h.Close < supportPrice {
			supportPrice = h.Close
			supportDate = h.Date
			supportVolume = h.Volume
		}

		if h.Close > resistancePrice {
			resistancePrice = h.Close
			resistanceDate = h.Date
			resistanceVolume = h.Volume
		}
	}

	return dto.QuarterDetail{Price: supportPrice, Date: supportDate, Volume: supportVolume}, dto.QuarterDetail{Price: resistancePrice, Date: resistanceDate, Volume: resistanceVolume}
}
