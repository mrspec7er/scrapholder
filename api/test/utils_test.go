package test

import (
	"sync"
	"testing"
	"time"

	"github.com/mrspec7er/scrapholder/app/dto"
	"github.com/mrspec7er/scrapholder/app/service"
	"github.com/mrspec7er/scrapholder/mock"
	"github.com/stretchr/testify/assert"
)

func init() {
	mock.Server()
}

type TestingUtils struct {
	service service.UtilService
}

func TestUtilService(t *testing.T) {
	utils := TestingUtils{}
	t.Run("should return stock fundamental analytic", func(t *testing.T) {

		statistic, recommendation, err := utils.service.InformationScrapper("ASII")

		assert.NoError(t, err, "Expected no error, but got: %v", err)

		assert.NotEmpty(t, statistic, "Expected 'statistic' to have at least one value")

		assert.NotEmpty(t, recommendation, "Expected 'recommendation' to have at least one value")
	})

	t.Run("should return stock histories", func(t *testing.T) {

		histories, err := utils.service.GetStockHistory("ASII", "2022-01-02", "2022-01-07")

		assert.NoError(t, err, "Expected no error, but got: %v", err)

		assert.NotEmpty(t, histories, "Expected 'statistic' to have at least one value")
	})

	t.Run("should return quarter histories", func(t *testing.T) {
		symbol := "BBNI"
		fromYear := 2023

		quarters := []*dto.QuarterHistory{}

		ctx := make(chan []*dto.QuarterHistory, (time.Now().Year())-fromYear+1)
		wg := &sync.WaitGroup{}
		wg.Add(time.Now().Year() - fromYear + 1)

		for i := fromYear; i <= time.Now().Year(); i++ {
			go utils.service.GetQuarterHistories(symbol, i, ctx, wg)
		}

		wg.Wait()
		close(ctx)

		for quarter := range ctx {
			quarters = append(quarters, quarter...)
		}

		assert.NotEmpty(t, quarters, "Expected 'quarters' to have at least one value")
	})
}
