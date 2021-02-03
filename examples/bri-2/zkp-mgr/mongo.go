package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func dbConnect(ctx context.Context) *mongo.Client {

	mongoURL := os.Getenv("MONGO_DB_URL")
	fmt.Println("MONGO_DB_URL:", mongoURL)

	credential := options.Credential{
		Username: "admin",
		Password: "password123",
	}

	clientOpts := options.Client().ApplyURI("mongodb://localhost:27117").SetAuth(credential)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatal(err)
	}

	return client
}
