package service_test

import (
	"fmt"
	"testing"

	"github.com/mrspec7er/scrapholder/app/service"
	"github.com/mrspec7er/scrapholder/mock"
)

func init() {
	mock.Server()
}

type TestingUtils struct {
	service service.UtilService
}

func TestUtilService(t *testing.T) {
	fmt.Println("TEST")
	utils := TestingUtils{}
	t.Run("should return stock fundamental analytic", func(t *testing.T) {

		statistic, recommendation, err := utils.service.InformationScrapper("ASII")

		if err != nil {
			t.Errorf(err.Error())
		}

		if len(statistic) < 1 {
			t.Errorf("Cannot Find Statistic Data")
		}

		if len(recommendation) < 1 {
			t.Errorf("Cannot Find Recommendation Result")
		}
	})
}
