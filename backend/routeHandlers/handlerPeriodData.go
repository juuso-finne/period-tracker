package routeHandlers

import (
	"backend/middleware"
	"backend/types"
	"encoding/json"
	"backend/models"
	"net/http"
	"log"
)

func AddDataRoutes(mux *http.ServeMux, h *DataHandler){

	mwh := middleware.MiddlewareHandler{
		Db: h.Db,
	}

	authentication := middleware.CreateStack(&mwh, middleware.Authenticate)
	authorization := middleware.CreateStack(&mwh, authentication, middleware.Authorize(h.getPeriodDataOwner))

	dataRouter := http.NewServeMux()
	dataRouter.HandleFunc("GET /", h.getPeriodData)
	dataRouter.HandleFunc("POST /", h.postPeriodData)

	dataRouterAuth := http.NewServeMux()
	dataRouterAuth.HandleFunc("PUT /", h.editPeriodData)
	dataRouterAuth.HandleFunc("DELETE /", h.deletePeriodData)

	authenticated := authentication(dataRouter, &mwh)
	authorized := authorization(dataRouterAuth, &mwh)

	mux.Handle("/data/", http.StripPrefix("/data", authenticated))
	mux.Handle("/data/mutate/", http.StripPrefix("/data/mutate", authorized))

}


func (h *DataHandler) getPeriodData(w http.ResponseWriter, r *http.Request){
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

func (h *DataHandler) postPeriodData(w http.ResponseWriter, r *http.Request){
	var d types.PeriodData
	err := json.NewDecoder(r.Body).Decode(&d)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	uid := r.Header.Get("uid")
	err = models.PostPeriodData(h.Db, &d, uid)

	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (h *DataHandler) editPeriodData(w http.ResponseWriter, r *http.Request){
	var newData types.PeriodData
	err := json.NewDecoder(r.Body).Decode(&newData)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	err = models.EditPeriodData(h.Db, &newData)

	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (h *DataHandler) deletePeriodData(w http.ResponseWriter, r *http.Request){
	var d struct{
		Id int `json:"id"`
	}
	err := json.NewDecoder(r.Body).Decode(&d)

	if err != nil{
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	err = models.DeletePeriodData(h.Db, d.Id)
		if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

func (h *DataHandler) getPeriodDataOwner (resourceId int) (string, error){
	owner, err := models.GetPeriodDataOwner(h.Db, resourceId)
	if err != nil{
		log.Println(err.Error())
		return "", err
	}
	return *owner, nil
}