package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/mrspec7er/scrapholder/app/dto"
	"github.com/redis/go-redis/v9"
)

type Redis struct{}

func (Redis) Client() *redis.Client {
	redisAddress := "127.0.0.1:6379"
	redisUsername := "default"
	redisPassword := ""
	client := redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: redisPassword,
		Username: redisUsername,
		DB:       0,
	})

	return client
}

func (r Redis) Retrieve(key string, histories *[]*dto.StockHistory) error {
	ctx := context.TODO()

	historiesStringified, err := r.Client().Get(ctx, key).Result()

	if err != nil {
		return err
	}

	err = json.Unmarshal([]byte(historiesStringified), &histories)

	return nil
}

func (r Redis) CacheHistory(key string, data []*dto.StockHistory) error {
	ctx := context.TODO()
	historiesStringified, err := json.Marshal(data)
	if err != nil {
		return err
	}

	err = r.Client().Set(ctx, key, historiesStringified, time.Hour).Err()

	return err
}
