package middleware

import(
	"net/http"
	"backend/models"
)
func Authenticate(next http.Handler, h *MiddlewareHandler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){

		st, err := r.Cookie("session_token")
		if err != nil || st.Value == ""{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		csrf := r.Header.Get(("X-CSRF-Token"))
		if csrf == ""{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userInfo, err := models.GetUserDataBytoken(h.Db, st.Value, csrf)
		if err != nil{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		r.Header.Set("uid", userInfo.Id)
		next.ServeHTTP(w, r)
	})
}