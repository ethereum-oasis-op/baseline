package main

import (
	"fmt"
	"log"
	"time"

	nats "github.com/nats-io/nats.go"
)

func InitNats() *nats.Conn {
	nc, err := nats.Connect(
		nats.DefaultURL,
		nats.Name("Demo connection name"),
		nats.Timeout(10*time.Second),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			// handle disconnect error event
			fmt.Println("Error: nats disconnected")
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			// handle reconnect event
			fmt.Println("Success: nats reconnected")
		}),
		nats.ReconnectWait(3*time.Second))
	if err != nil {
		log.Fatal(err)
	}
	return nc
}
