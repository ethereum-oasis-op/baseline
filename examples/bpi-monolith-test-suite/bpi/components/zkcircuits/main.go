package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"zkcircuit/circuitlib"
	"zkcircuit/json"

	"github.com/gin-gonic/gin"
)

func Proof(c *gin.Context) {
	var p json.OrderCircuitInput
	if err := c.BindJSON(&p); err != nil {
		log.Fatal(err)
		return
	}

	prf, err := circuitlib.GenerateProof(p)

	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusInternalServerError, err)
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
	var v json.VerifyInput

	if err := c.BindJSON(&v); err != nil {
		log.Fatal(err)
		return
	}

	prf, err := hex.DecodeString(v.P)
	if err != nil {
		fmt.Println(err)
	}

	_prf, err := circuitlib.DeserializeProof(prf)
	if err != nil {
		fmt.Println(err)
	}

	err = circuitlib.VerifyProof(v.I, _prf)
	if err != nil {
		fmt.Println(err)
		c.IndentedJSON(http.StatusInternalServerError, err)
	} else {
		c.IndentedJSON(http.StatusOK, "Valid Proof")
	}
}

func main() {
	router := gin.Default()
	router.POST("/prove", Proof)
	router.POST("/verify", Verify)
	router.Run("localhost:8080")
}
