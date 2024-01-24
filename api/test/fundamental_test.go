package test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/mrspec7er/scrapholder/mock"
	"github.com/stretchr/testify/assert"
)

func TestFundamentalAnalytic(t *testing.T) {
	t.Run("should return stock quarter analytic", func(t *testing.T) {

		query := `{
			fundamentalAnalytic(symbol: "ASII"){
                statistic{
                    label,
                    value
                },
                recommendation{
                    title,
                    body,
                    url,
                }
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

		fundamentalAnalytic, ok := data["fundamentalAnalytic"].(map[string]interface{})
		assert.True(t, ok, "Expected 'fundamentalAnalytic' field in response")

		recommendation, ok := fundamentalAnalytic["recommendation"].([]interface{})
		assert.True(t, ok, "Expected 'recommendation' field in response to be type of slice")
		assert.NotEmpty(t, recommendation, "Expected 'recommendation' to have at least one value")

		statistic, ok := fundamentalAnalytic["statistic"].([]interface{})
		assert.True(t, ok, "Expected 'statistic' field in response to be type of slice")
		assert.NotEmpty(t, statistic, "Expected 'statistic' to have at least one value")
	})
}
