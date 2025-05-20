package middleware

import(
	"net/http"
	"backend/models"
	"backend/types"
	"encoding/json"
	"log"
	"io"
	"bytes"
)
func Authorize(next http.Handler, h *MiddlewareHandler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		uid := r.Header.Get("uid")

		body, err := io.ReadAll(r.Body)
		// Replace the body with a new reader after reading from the original
		r.Body = io.NopCloser(bytes.NewBuffer(body))

		var newData types.PeriodData
		err = json.NewDecoder(io.NopCloser(bytes.NewBuffer(body))).Decode(&newData)
		if err != nil{
			log.Println(err.Error())
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		owner, err := models.GetDataOwner(h.Db, newData.Id)
		if err != nil{
			log.Println(err.Error())
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if *owner != uid{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}