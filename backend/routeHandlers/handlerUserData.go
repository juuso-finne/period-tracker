package routeHandlers

import (
	"backend/middleware"
	"backend/models"
	"backend/types"
	"backend/utils"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func AddUserRoutes(mux *http.ServeMux, h *DataHandler){
	dataRouter := http.NewServeMux()
	dataRouter.HandleFunc("POST /register", h.register)
	dataRouter.HandleFunc("POST /login", h.login)

	mwh := middleware.MiddlewareHandler{
		Db: h.Db,
	}

	authedRouter := http.NewServeMux()
	authentication := middleware.CreateStack(&mwh, middleware.Authenticate)
	authedRouter.HandleFunc("PUT /logout", h.logout)
	authedRouter.HandleFunc("DELETE /", h.deleteUser)

	mux.Handle("/users/", http.StripPrefix("/users", dataRouter))
	mux.Handle("/users/auth/", http.StripPrefix("/users/auth", authentication(authedRouter, &mwh)))
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

	user, err := models.GetUserData(h.Db, d.Username)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	utils.UserLogin(w, d.Username, h.Db, user.Id)

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
		http.Error(w, "Wrong username or password", http.StatusUnauthorized)
		return
	}

	utils.UserLogin(w, d.Username, h.Db, user.Id)


	w.WriteHeader(http.StatusOK)
}

func (h *DataHandler) logout (w http.ResponseWriter, r *http.Request){
	uid := r.Header.Get("uid")

	err := models.ClearTokens(h.Db, uid)

	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (h *DataHandler) deleteUser (w http.ResponseWriter, r *http.Request){
	uid := r.Header.Get("uid")

	err := models.DeleteUser(h.Db, uid)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}