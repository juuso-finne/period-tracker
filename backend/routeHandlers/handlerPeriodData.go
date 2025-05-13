package routeHandlers

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"log"
)



func (h *DataHandler) GetPeriodData(w http.ResponseWriter, r *http.Request){
	uid := r.Header.Get("uid")
	data, err := models.GetPeriodData(h.Db, uid)

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