package middleware

import(
	"net/http"
	"backend/utils"
	"backend/models"
)
func Authenticate(next http.Handler, h *MiddlewareHandler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){

		username, err := r.Cookie("username")
		if err != nil || username.Value == ""{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

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

		userInfo, err := models.GetUserData(h.Db, username.Value)
		if err != nil{
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		stHash, ok1 := userInfo.Session.(string)
		csrfHash, ok2 := userInfo.Csrf.(string)
		if !ok1 || !ok2 {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if !utils.VerifyTokens(st.Value, csrf, stHash, csrfHash){
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		r.Header.Set("uid", userInfo.Id)
		next.ServeHTTP(w, r)
	})
}