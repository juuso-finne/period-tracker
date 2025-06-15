package middleware

import (
  "net/http"
  "slices"
)

var originAllowlist = []string{
  "http://localhost:5173",
}

func CheckCORS(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    origin := r.Header.Get("Origin")
    if r.URL.Path == "/images/" || slices.Contains(originAllowlist, origin) {
      w.Header().Set("Access-Control-Allow-Origin", origin)
	    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
	    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token")
	    w.Header().Set("Access-Control-Allow-Credentials", "true")
    }
    w.Header().Add("Vary", "Origin")

	// Handle preflight requests
    if r.Method == "OPTIONS" {
      w.WriteHeader(http.StatusOK)
      return
    }

    next.ServeHTTP(w, r)
  })
}