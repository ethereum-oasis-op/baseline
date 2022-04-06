package main

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func DbConnect(ctx context.Context) *mongo.Client {
	godotenv.Load(".env")
	dbHost := os.Getenv("DATABASE_HOST")
	dbName := os.Getenv("DATABASE_NAME")
	dbUser := os.Getenv("DATABASE_USER")
	dbPassword := os.Getenv("DATABASE_PASSWORD")
	credential := options.Credential{
		AuthSource: dbName,
		Username:   dbUser,
		Password:   dbPassword,
	}

	clientOpts := options.Client().ApplyURI("mongodb://" + dbHost).SetAuth(credential)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatal("Error connecting to mongodb: " + err.Error())
	}

	return client
}
