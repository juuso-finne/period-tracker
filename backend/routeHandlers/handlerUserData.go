package routeHandlers

import (
	"backend/models"
	"backend/types"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func AddUserRoutes(mux *http.ServeMux, h *DataHandler){
	dataRouter := http.NewServeMux()
	dataRouter.HandleFunc("POST /register", h.register)
	dataRouter.HandleFunc(("POST /login"), h.login)

	mux.Handle("/users/", http.StripPrefix("/users", dataRouter))
}

func (h *DataHandler) register (w http.ResponseWriter, r *http.Request){
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

func (h *DataHandler) login (w http.ResponseWriter, r *http.Request){
	var d types.LoginData
	err := json.NewDecoder(r.Body).Decode(&d)
	if err != nil{
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, err := models.GetUserData(h.Db, d.Username)
	if err != nil{
		if err == sql.ErrNoRows{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(d.Password))
	if err != nil{
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}