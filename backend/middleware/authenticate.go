package middleware

import(
	"net/http"
	"backend/models"
)
func Authenticate(next http.Handler, h *MiddlewareHandler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		username := r.Header.Get("username")

		userInfo, err := models.GetUserData(h.Db, username)
		if err != nil{
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		st, err := r.Cookie("session_token")
		if err != nil || st.Value != userInfo.Session || st.Value == ""{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		csrf := r.Header.Get(("X-CSRF-Token"))
		if csrf != userInfo.Csrf || csrf == ""{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		r.Header.Set("uid", userInfo.Id)
		next.ServeHTTP(w, r)
	})
}