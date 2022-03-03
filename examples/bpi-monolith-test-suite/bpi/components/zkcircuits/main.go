package main

import (
	"net/http"
	"zkcircuit/circuitlib"

	"github.com/gin-gonic/gin"
)

type circuit struct {
	Name string `json:"Name"`
}

type orderCircuit struct {
	ASC string `json:"ASC`
	SOC string `json:"SOC`
}

var circuits = []circuit{
	{Name: "cubic"},
}

// getCircuits response with a list of all circuits
func getCircuits(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, circuits)
}

func postOrderCircuit(c *gin.Context) {
	var orderCircuit orderCircuit

	if err := c.BindJSON(&orderCircuit); err != nil {
		return
	}

	c.IndentedJSON(http.StatusOK, circuitlib.CallCircuit(orderCircuit.ASC, orderCircuit.SOC))
}

func main() {
	router := gin.Default()
	router.GET("/circuits", getCircuits)
	router.POST("/orderCircuit", postOrderCircuit)
	router.Run("localhost:8080")
}
