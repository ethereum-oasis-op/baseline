package main

import (
	"bytes"
	"context"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/backend/r1cs"
	"github.com/consensys/gurvy"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	nats "github.com/nats-io/nats.go"
	"github.com/pborman/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ZKCircuit : Schema for mongoDb
type ZKCircuit struct {
	ID           string   `bson:"_id" json:"_id"`
	Name         string   `bson:"name" json:"name"`
	CurveID      gurvy.ID `bson:"curveId" json:"curveId" binding:"required"`
	ProvingKey   []byte   `bson:"provingKey" json:"provingKey"`
	VerifyingKey []byte   `bson:"verifyingKey" json:"verifyingKey"`
	Status       string   `bson:"status" json:"status" form:"status"`
}

type createCircuitReq struct {
	Name       string                `form:"name" json:"name" binding:"required"`
	SourceCode *multipart.FileHeader `form:"sourceCode" json:"sourceCode"`
	CurveID    gurvy.ID              `form:"curveId" json:"curveId"`
}

var dbClient *mongo.Client
var natsClient *nats.Conn
var compileQueue chan string
var setupQueue chan string
var proveQueue chan string
var verifyQueue chan string

const zkCircuitCollection = "zk-circuits"

/******************************************************/
/***      Main                                      ***/
/******************************************************/

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file: " + err.Error())
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to mongoDb
	dbClient = dbConnect(ctx)
	defer func() {
		if err := dbClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	// Connect to NATS
	//natsClient = initNats()
	//defer natsClient.Close()

	// Constantly running background processes
	compileQueue = make(chan string)
	go compileCircuits()

	setupQueue = make(chan string)
	go setupCircuits()

	// Create a gin router with default middleware: logger and recovery
	router := gin.Default()

	router.GET("/status", getStatus)
	router.POST("/zkcircuits", createCircuit)
	router.GET("/zkcircuits", getAllCircuits)
	router.GET("/zkcircuits/:circuitID", getSingleCircuit)
	router.POST("/zkcircuits/:circuitID/setup", setup)
	router.POST("/zkcircuits/:circuitID/prove", prove)
	router.POST("/zkcircuits/:circuitID/verify", verify)

	serverPort := os.Getenv("SERVER_PORT")
	router.Run(":" + serverPort)
}

/******************************************************/
/***      Go routines                               ***/
/******************************************************/

func compileCircuits() {
	for {
		circuitID := <-compileQueue
		log.Println("Starting compilation for circuit: ", circuitID)

		// Copy source code into circuits/circuit.go
		sourceFile := "src/circuits/uncompiled/" + circuitID + ".go"
		destinationFile := "src/circuits/circuit.go"

		input, err := ioutil.ReadFile(sourceFile)
		if err != nil {
			log.Fatal("Error opening file: " + err.Error())
		}

		err = ioutil.WriteFile(destinationFile, input, 0644)
		if err != nil {
			log.Fatal("Error creating file: " + err.Error())
		}

		// Compile and create circuit.r1cs file
		cmd := exec.Command("go", "run", ".")
		cmd.Dir = "src/circuits"
		_, err = cmd.Output()
		if err != nil {
			log.Fatal("Error: " + err.Error())
		}

		// Copy circuit.r1cs into circuits/compiled/<circuitID>.r1cs
		sourceFile = "src/circuits/circuit.r1cs"
		destinationFile = "src/circuits/compiled/" + circuitID + ".r1cs"

		input, err = ioutil.ReadFile(sourceFile)
		if err != nil {
			log.Fatal("Error opening file: " + err.Error())
		}

		err = ioutil.WriteFile(destinationFile, input, 0644)
		if err != nil {
			log.Fatal("Error creating file: " + err.Error())
		}

		// Update zk-circuit in db: set status to "compiled"
		collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		filter := bson.M{"_id": circuitID}
		update := bson.M{"$set": bson.M{"status": "compiled"}}

		_, err = collection.UpdateOne(ctx, filter, update)
		if err != nil {
			log.Fatal("Error updating db: " + err.Error())
		}
		log.Println("Finished compilation for circuit: ", circuitID)
	}
}

func setupCircuits() {
	for {
		circuitID := <-setupQueue
		log.Println("Starting setup for circuit: ", circuitID)

		// Get zk circuit collection for later updates
		collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		filter := bson.M{"_id": circuitID}

		// Create reader for r1cs file
		path := "src/circuits/compiled/" + circuitID + ".r1cs"
		var r io.Reader
		r, err := os.Open(path)
		if err != nil {
			log.Println("[ERROR: Read r1cs file] " + err.Error())
			update := bson.M{"$set": bson.M{"status": "setup_failed"}}
			_, err = collection.UpdateOne(ctx, filter, update)
			continue
		}

		// Decode r1cs binary, store in compiledCircuit
		compiledCircuit := r1cs.New(gurvy.BN256)
		_, err = compiledCircuit.ReadFrom(r)
		if err != nil {
			log.Println("[ERROR: Decode r1cs] " + err.Error())
			update := bson.M{"$set": bson.M{"status": "setup_failed"}}
			_, err = collection.UpdateOne(ctx, filter, update)
			continue
		}

		pk, vk, err := groth16.Setup(compiledCircuit)
		if err != nil {
			log.Println("[ERROR: Gnark setup] " + err.Error())
			update := bson.M{"$set": bson.M{"status": "setup_failed"}}
			_, err = collection.UpdateOne(ctx, filter, update)
			continue
		}

		var pkBuf bytes.Buffer
		var vkBuf bytes.Buffer
		pk.WriteRawTo(&pkBuf)
		vk.WriteRawTo(&vkBuf)

		// Update db to add keys, update status
		update := bson.M{"$set": bson.M{"provingKey": pkBuf.Bytes(), "verifyingKey": vkBuf.Bytes(), "status": "setup_complete"}}
		_, err = collection.UpdateOne(ctx, filter, update)
		if err != nil {
			log.Println("[ERROR: Mongo UpdateOne] " + err.Error())
			continue
		}
		log.Println("Finished setup for circuit: ", circuitID)
	}
}

/******************************************************/
/***      Router functions                          ***/
/******************************************************/

func getStatus(c *gin.Context) {
	c.String(http.StatusOK, "Zkp service is running")
}

func getSingleCircuit(c *gin.Context) {
	var circuit ZKCircuit
	circuitID := c.Param("circuitID")

	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err := collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not query database",
		})
		return
	}

	c.JSON(http.StatusOK, circuit)
}

func getAllCircuits(c *gin.Context) {
	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var circuits []bson.M

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not query database",
		})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var circuit bson.M
		if err = cursor.Decode(&circuit); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		circuits = append(circuits, circuit)
	}
	c.JSON(http.StatusOK, circuits)
}

func createCircuit(c *gin.Context) {
	var requestBody createCircuitReq
	var zkCircuitDoc ZKCircuit

	err := c.ShouldBind(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Request body missing fields:" + err.Error(),
		})
		return
	}

	// Create new uuid v4
	id := uuid.NewRandom().String()
	zkCircuitDoc.ID = id
	zkCircuitDoc.Name = requestBody.Name
	zkCircuitDoc.Status = "created"
	zkCircuitDoc.CurveID = gurvy.BN256 // default curveId is BN256 for now
	if requestBody.CurveID != 0 {
		zkCircuitDoc.CurveID = requestBody.CurveID
	}

	// Create temporary source file
	file, err := c.FormFile("sourceCode")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err = c.SaveUploadedFile(file, "src/circuits/uncompiled/"+id+".go")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not save uploaded file:" + err.Error(),
		})
		return
	}

	// Save file artifacts in db
	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, zkCircuitDoc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Mongo InsertOne:" + err.Error(),
		})
		return
	}

	// Create new job to compile circuit, then create circuit.r1cs
	compileQueue <- id

	c.JSON(http.StatusCreated, result)
}

func setup(c *gin.Context) {
	circuitID := c.Param("circuitID")

	// Update db to add keys, update status
	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	update := bson.M{"$set": bson.M{"status": "setup_started"}}
	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "[Mongo UpdateOne] " + err.Error(),
		})
		return
	}

	// Create new job to generate proving/verifying key, then update db
	setupQueue <- circuitID

	c.JSON(http.StatusOK, gin.H{
		"message": "Setup job queued for circuit ID " + circuitID,
	})
}

func prove(c *gin.Context) {
	type generateProofReq struct {
		Witness interface{} `form:"witness" json:"witness" xml:"witness"  binding:"required"`
	}

	var requestBody generateProofReq
	err := c.BindJSON(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Request body missing fields",
		})
	}

	circuitID := c.Param("circuitID")

	// Create reader for r1cs file
	path := "src/circuits/compiled/" + circuitID + ".r1cs"
	var r io.Reader
	r, err = os.Open(path)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "[Read r1cs file] " + err.Error(),
		})
		return
	}

	// Decode r1cs binary, store in compiledCircuit
	compiledCircuit := r1cs.New(gurvy.BN256)
	_, err = compiledCircuit.ReadFrom(r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "[Decode r1cs] " + err.Error(),
		})
		return
	}

	// Get circuit from db
	var circuit ZKCircuit
	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err = collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "[Mongo FindOne] " + err.Error(),
		})
		return
	}

	// Convert proving key from []byte to groth16.ProvingKey
	buf := bytes.NewReader(circuit.ProvingKey)
	provingKey := groth16.NewProvingKey(gurvy.BN256)
	provingKey.ReadFrom(buf)

	proof, err := groth16.Prove(compiledCircuit, provingKey, requestBody.Witness)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "[groth16.Prove] " + err.Error(),
		})
		return
	}

	var proofBuf bytes.Buffer
	proof.WriteTo(&proofBuf)

	c.JSON(http.StatusOK, gin.H{
		"proof": proofBuf.Bytes(),
	})
}

func verify(c *gin.Context) {
	// Witness only needs to contain public inputs here
	type verifyProofReq struct {
		Proof   []byte      `form:"proof" json:"proof" xml:"proof"  binding:"required"`
		Witness interface{} `form:"witness" json:"witness" xml:"witness"  binding:"required"`
	}

	var requestBody verifyProofReq
	err := c.BindJSON(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "[Parsing request body] " + err.Error(),
		})
		return
	}

	circuitID := c.Param("circuitID")

	// Get circuit from db
	var circuit ZKCircuit
	collection := dbClient.Database("baseline").Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err = collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "[Mongo FindOne] " + err.Error(),
		})
		return
	}

	// Convert verifying key from []byte to groth16.VerifyingKey
	vkBuf := bytes.NewReader(circuit.VerifyingKey)
	verifyingKey := groth16.NewVerifyingKey(gurvy.BN256)
	verifyingKey.ReadFrom(vkBuf)

	// Convert proof
	proofBuf := bytes.NewReader(requestBody.Proof)
	proof := groth16.NewProof(gurvy.BN256)
	proof.ReadFrom(proofBuf)

	if err = groth16.Verify(proof, verifyingKey, requestBody.Witness); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "[groth16.Verify] " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"result": "verified",
	})
}
