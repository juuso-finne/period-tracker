package main

import (
	"net/http"
	"github.com/joho/godotenv"
	"log"
	"os"
	"fmt"
	"backend/routeHandlers"
)

func main(){
	if err := godotenv.Load("../.env"); err != nil{
		log.Fatalf("Error loading .env file")
	}

	port := os.Getenv("PORT")

	db, err := connectToDB()
	if err != nil{
		log.Fatalf("Error connecting to database: %v", err)
	}

	err = db.Ping()
	if err != nil{
		log.Fatalf("Error pinging database: %v", err)
	} else {
		fmt.Println("Connected to DB")
	}



	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func (w http.ResponseWriter, r *http.Request){
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	h := routeHandlers.DataHandler{
		Db: db,
	}

	routeHandlers.AddDataRoutes(mux, &h)
	routeHandlers.AddUserRoutes(mux, &h)


	fmt.Printf("API listening on port %s\n", port)
	http.ListenAndServe(port, mux)


}