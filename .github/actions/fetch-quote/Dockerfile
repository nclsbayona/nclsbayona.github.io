FROM golang:1.25 AS build
WORKDIR /src
COPY get_quote.go go.mod ./
RUN CGO_ENABLED=0 go build -o /bin/main .

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /bin/main /bin/main
ENTRYPOINT ["/bin/main"]