package routeHandlers

import (
	"net/http"
	"backend/models"
	"backend/types"
	"encoding/json"
	"log"
)

func AddUserRoutes(mux *http.ServeMux, h *DataHandler){
	dataRouter := http.NewServeMux()
	dataRouter.HandleFunc("POST /register", h.Register)

	mux.Handle("/users/", http.StripPrefix("/users", dataRouter))
}

func (h *DataHandler) Register (w http.ResponseWriter, r *http.Request){
	var d types.LoginData
	err := json.NewDecoder(r.Body).Decode(&d)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	err = models.AddUserData(h.Db, &d)
	if err !=nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}