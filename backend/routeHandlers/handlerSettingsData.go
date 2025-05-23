package routeHandlers

import (
	"backend/middleware"
	"backend/types"
	"encoding/json"
	"backend/models"
	"net/http"
	"log"
)

func AddSettingsRoutes(mux *http.ServeMux, h *DataHandler){

	mwh := middleware.MiddlewareHandler{
		Db: h.Db,
	}

	authentication := middleware.CreateStack(&mwh, middleware.Authenticate)

	dataRouter := http.NewServeMux()
	dataRouter.HandleFunc("GET /", h.getSettingsData)
	dataRouter.HandleFunc("PUT /", h.editSettingsData)

	mux.Handle("/data/", http.StripPrefix("/data", authentication(dataRouter, &mwh)))
}

func (h *DataHandler) getSettingsData(w http.ResponseWriter, r *http.Request){
	uid := r.Header.Get("uid")

	data, err := models.GetSettingsData(h.Db, uid)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(data)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Constent-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func (h *DataHandler) editSettingsData(w http.ResponseWriter, r *http.Request){
	var newData types.SettingsData
	err := json.NewDecoder(r.Body).Decode(&newData)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	uid := r.Header.Get("uid")
	err = models.EditSettingsData(h.Db, &newData, uid)

	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}