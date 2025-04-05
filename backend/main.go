package main

import (
	"net/http"
	"github.com/joho/godotenv"
	"log"
	"os"
	"fmt"
)

func main(){
	if err := godotenv.Load("../.env"); err != nil{
		log.Fatalf("Error loading .env file")
	}

	port := os.Getenv("PORT")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", health)


	fmt.Printf("API listening on port %s\n", port)
	http.ListenAndServe(port, mux)


}