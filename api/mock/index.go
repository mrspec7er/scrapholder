package mock

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"runtime"

	"github.com/graphql-go/graphql"
	"github.com/joho/godotenv"
	"github.com/mrspec7er/scrapholder/app/repository"
	"github.com/mrspec7er/scrapholder/app/schema"
)

var (
	_, b, _, _ = runtime.Caller(0)
	basePath   = filepath.Dir(b)
)

func Server() {
	err := godotenv.Load(basePath + "/.env")
	if err != nil {
		panic("Error loading .env file")
	}

	repository.RedisConnection()
}

func QueryExecutor(w http.ResponseWriter, r *http.Request) {
	params := graphql.Params{
		Schema:        schema.StockAnalysisSchema,
		RequestString: r.FormValue("query"),
	}

	result := graphql.Do(params)

	json.NewEncoder(w).Encode(result)
}
