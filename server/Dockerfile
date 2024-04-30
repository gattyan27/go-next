FROM golang:1.22

# protocと必要なプラグインをインストール
RUN apt-get update && apt-get install -y protobuf-compiler && \
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

RUN go install github.com/cosmtrek/air@latest

WORKDIR /app

COPY go.mod ./

RUN go mod tidy

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 50051

# airを起動コマンドとして設定
CMD ["air"]