package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"zkcircuit/circuitlib"

	"github.com/gin-gonic/gin"
)

type circuit struct {
	Name string `json:"Name"`
}

type OV struct {
	ASC string `json:"ASC"`
	SOC string `json:"SOC"`
	P   string `json:"P"`
}

type OP struct {
	ASC string `json:"ASC"`
	SOC string `json:"SOC"`
}

var circuits = []circuit{
	{Name: "orderCircuit"},
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

	prf, m := circuitlib.GenerateProof(op.ASC, op.SOC)

	if m != "" {
		c.IndentedJSON(http.StatusOK, m)
	} else {
		buf := new(bytes.Buffer)
		_, err := prf.(io.WriterTo).WriteTo(buf)
		if err != nil {
			fmt.Println(err)
		}
		_prf := hex.EncodeToString(buf.Bytes())
		c.IndentedJSON(http.StatusOK, _prf)
	}
}

func Verify(c *gin.Context) {
	var ov OV

	if err := c.BindJSON(&ov); err != nil {
		log.Fatal(err)
		return
	}

	prf, err := hex.DecodeString(ov.P)
	if err != nil {
		fmt.Println(err)
	}

	_prf, err := circuitlib.DeserializeProof(prf)
	if err != nil {
		fmt.Println(err)
	}

	m := circuitlib.VerifyProof(ov.ASC, ov.SOC, _prf)
	c.IndentedJSON(http.StatusOK, m)
}

func main() {
	router := gin.Default()
	router.GET("/circuits", getCircuits)
	router.POST("/prove", Proof)
	router.POST("/verify", Verify)
	router.Run("localhost:8080")
}
