package repository

import (
	"context"
	"encoding/json"
	"os"
	"time"

	"github.com/mrspec7er/scrapholder/app/dto"
	"github.com/redis/go-redis/v9"
)

type Redis struct{}

var memcache *redis.Client

func RedisConnection() {
	redisAddress := os.Getenv("REDIS_ADDRESS")
	redisUsername := os.Getenv("REDIS_USERNAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	memcache = redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: redisPassword,
		Username: redisUsername,
		DB:       0,
	})
}

func (r Redis) RetrieveHistories(key string, histories *[]*dto.StockHistory) error {
	ctx := context.TODO()

	historiesStringified, err := memcache.Get(ctx, key).Result()

	if err != nil {
		return err
	}

	err = json.Unmarshal([]byte(historiesStringified), &histories)

	return nil
}

func (r Redis) CacheHistories(key string, data []*dto.StockHistory) error {
	ctx := context.TODO()
	historiesStringified, err := json.Marshal(data)
	if err != nil {
		return err
	}

	err = memcache.Set(ctx, key, historiesStringified, time.Hour).Err()

	return err
}
