package main

import "C"

func main() {}

//export add
func add(a, b int) int {
	return a + b
}
