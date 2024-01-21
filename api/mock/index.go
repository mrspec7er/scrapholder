package mock

import (
	"path/filepath"
	"runtime"

	"github.com/joho/godotenv"
	"github.com/mrspec7er/scrapholder/app/repository"
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
