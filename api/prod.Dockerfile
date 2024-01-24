FROM golang:1.21.5-bookworm

WORKDIR /api

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build main.go

RUN go test -v ./test

RUN chmod +x main

EXPOSE 8080

CMD ./main