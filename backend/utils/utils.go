package utils

import (
	"net/http"
	"crypto/rand"
	"encoding/base64"
	"os"
	"time"
)

func GenerateToken(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return base64.URLEncoding.EncodeToString(bytes)
}

func SetCookies(w http.ResponseWriter, session string, csrf string) error {
	exp, exists := os.LookupEnv("TOKEN_EXPIRATION")

		if !exists{
		exp="48h"
	}

	d, err := time.ParseDuration(exp)
	if err != nil{
		return err
	}

	http.SetCookie(w, &http.Cookie{
		Name: "session_token",
		Value: session,
		Expires: time.Now().Add(d),
		HttpOnly: true,
	})

		http.SetCookie(w, &http.Cookie{
		Name: "csrf_token",
		Value: csrf,
		Expires: time.Now().Add(d),
		HttpOnly: false,
	})

	return nil
}
