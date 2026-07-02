FROM docker.io/golang:1.26.3 AS build
WORKDIR /src
COPY go.mod ./
COPY cmd/fetch-quote ./cmd/fetch-quote
COPY pkg/quote ./pkg/quote
RUN CGO_ENABLED=0 go build -o /bin/main ./cmd/fetch-quote

FROM docker.io/alpine:latest
COPY --from=build /bin/main /bin/main
ENTRYPOINT ["/bin/main"]
