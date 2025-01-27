FROM golang:1.15-alpine AS builder 

RUN mkdir -p /go/src/github.com/ethereum-oasis/baseline/zkp-mgr
COPY . /go/src/github.com/ethereum-oasis/baseline/zkp-mgr/
WORKDIR "/go/src/github.com/ethereum-oasis/baseline/zkp-mgr"
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -a -o zkp-mgr src/*.go
RUN mv /go/src/github.com/ethereum-oasis/baseline/zkp-mgr /root/zkp-mgr

FROM golang:1.15-alpine
# RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /root/zkp-mgr .
CMD ["./zkp-mgr"]  
EXPOSE 8080