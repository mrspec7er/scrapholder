package main

import (
	"fmt"
	"net/http"

	"github.com/graphql-go/handler"
	"github.com/joho/godotenv"
	"github.com/mrspec7er/scrapholder/app/repository"
	"github.com/mrspec7er/scrapholder/app/schema"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

func main() {
	repository.RedisConnection()

	h := handler.New(&handler.Config{
		Schema:   &schema.StockAnalysisSchema,
		Pretty:   true,
		GraphiQL: false,
	})

	http.Handle("/graphql", h)

	http.ListenAndServe(":8080", nil)
}
