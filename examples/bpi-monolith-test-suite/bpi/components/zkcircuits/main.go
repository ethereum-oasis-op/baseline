package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"zkcircuit/circuitlib"

	"github.com/consensys/gnark-crypto/ecc"

	"github.com/consensys/gnark/backend/groth16"

	"github.com/gin-gonic/gin"
)

type circuit struct {
	Name string `json:"Name"`
}

type OV struct {
	ASC string        `json:"ASC"`
	SOC string        `json:"SOC"`
	P   groth16.Proof `json:"P"`
}

type OP struct {
	ASC string `json:"ASC"`
	SOC string `json:"SOC"`
}

var circuits = []circuit{
	{Name: "cubic"},
}

// getCircuits response with a list of all circuits
func getCircuits(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, circuits)
}

func Proof(c *gin.Context) {
	var op OP
	if err := c.BindJSON(&op); err != nil {
		return
	}
	p, m := circuitlib.GenerateProof(op.ASC, op.SOC)
	if m != "" {
		c.IndentedJSON(http.StatusBadRequest, m)
	} else {

		raw, _ := json.Marshal(p)
		fmt.Println(string(raw))
		c.IndentedJSON(http.StatusOK, string(raw))
	}
}

type ProveResponse struct {
	Proof string `json:"proof"`
}

func Verify(c *gin.Context) {
	var ov OV
	// json.Unmarshal(ov.P, &proof)
	if err := c.BindJSON(&ov); err != nil {
		log.Fatal(err)
		return
	}
	m := circuitlib.VerifyProof(ov.ASC, ov.SOC, ov.P)
	if m != "" {
		fmt.Println(m)
		c.IndentedJSON(http.StatusBadRequest, m)
	} else {
		c.IndentedJSON(http.StatusOK, m)
	}
}

func main() {
	router := gin.Default()
	router.GET("/circuits", getCircuits)
	router.POST("/prove", Proof)
	router.POST("/verify", Verify)
	router.Run("localhost:8080")
}

func decodeProof(proof []byte) (interface{}, error) {
	var err error
	var prf interface{}

	prf = groth16.NewProof(ecc.BN254)
	_, err = prf.(groth16.Proof).ReadFrom(bytes.NewReader(proof))

	if err != nil {
		// common.Log.Warningf("unable to decode proof; %s", err.Error())
		return nil, err
	}

	return prf, nil
}
