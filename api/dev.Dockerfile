FROM golang:1.21.5-bookworm

WORKDIR /api

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go install github.com/zzwx/fresh@latest

RUN fresh -g

EXPOSE 8080

CMD fresh