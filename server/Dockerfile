FROM golang:1.22

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 50051

# airをインストール
RUN go install github.com/cosmtrek/air@latest

# airの設定ファイルをコピー（あらかじめ作成しておく必要があります）
COPY .air.toml ./

# airを起動コマンドとして設定
CMD ["air"]