package test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mrspec7er/scrapholder/mock"
	"github.com/stretchr/testify/assert"
)

func TestTechnicalAnalytic(t *testing.T) {
	t.Run("should return stock quarter analytic", func(t *testing.T) {

		query := `{
			quarterHistories(fromYear: 2023, symbol:"BMRI"){
				averageSupport,
				averageResistance,
				quarters{quarter, high{date, price, volume}, low{date, price, volume}}
			}
		}`

		req, err := http.NewRequest("POST", "/graphql", nil)
		if err != nil {
			t.Fatal(err)
		}

		req.PostForm = map[string][]string{"query": {query}}

		rr := httptest.NewRecorder()

		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			mock.QueryExecutor(w, r)
		})

		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var result map[string]interface{}
		err = json.Unmarshal([]byte(rr.Body.String()), &result)
		if err != nil {
			t.Fatal(err)
		}

		data, ok := result["data"].(map[string]interface{})
		assert.True(t, ok, "Expected 'data' field in response")

		quarterHistories, ok := data["quarterHistories"].(map[string]interface{})
		assert.True(t, ok, "Expected 'quarterHistories' field in response")

		averageResistance, ok := quarterHistories["averageResistance"].(float64)
		assert.True(t, ok, "Expected 'averageResistance' field in response to be type of float64")
		assert.Greater(t, averageResistance, 0.0, "Expected 'averageResistance' to be more than 0")

		averageSupport, ok := quarterHistories["averageSupport"].(float64)
		assert.True(t, ok, "Expected 'averageSupport' field in response to be type of float64")
		assert.Greater(t, averageSupport, 0.0, "Expected 'averageSupport' to be more than 0")

		quarters, ok := quarterHistories["quarters"].([]interface{})
		assert.True(t, ok, "Expected 'quarters' field in response")

		assert.NotEmpty(t, quarters, "Expected 'quarters' to have at least values")
	})

	t.Run("should return stock histories", func(t *testing.T) {

		query := `{
			stockHistories(symbol: "BBRI", fromDate:"2022-01-02", toDate:"2022-01-07") {
				symbol,
				date,
				open,
				close,
				high,
				low,
				volume
			}
		}`

		req, err := http.NewRequest("POST", "/graphql", nil)
		if err != nil {
			t.Fatal(err)
		}

		req.PostForm = map[string][]string{"query": {query}}

		rr := httptest.NewRecorder()

		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			mock.QueryExecutor(w, r)
		})

		handler.ServeHTTP(rr, req)

		assert.Equal(t, http.StatusOK, rr.Code)

		var result map[string]interface{}
		err = json.Unmarshal([]byte(rr.Body.String()), &result)
		if err != nil {
			t.Fatal(err)
		}

		data, ok := result["data"].(map[string]interface{})
		assert.True(t, ok, "Expected 'data' field in response")

		stockHistories, ok := data["stockHistories"].([]interface{})
		assert.True(t, ok, "Expected 'stockHistories' field in response")

		assert.NotEmpty(t, stockHistories, "Expected 'histories' to have at least values")

		fmt.Println(stockHistories...)

	})
}
