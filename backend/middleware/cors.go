package middleware

import (
  "net/http"
  "slices"
  "os"
  "fmt"
)

var originAllowlist = []string{}

func CheckCORS(next http.Handler) http.Handler {
  frontend_url, exists := os.LookupEnv("FROTNEND_URL")
	if !exists{
		frontend_url = "http://localhost"
	}

  frontend_port, exists := os.LookupEnv("FRONTEND_PORT")
	if !exists{
		frontend_port = "5173"
	}

  originAllowlist = append(originAllowlist, fmt.Sprintf("%s:%s", frontend_url, frontend_port))

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