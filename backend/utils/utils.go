package utils

import (
	"backend/models"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"log"
	"net/http"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func GenerateToken(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return base64.URLEncoding.EncodeToString(bytes)
}

func setCookies(w http.ResponseWriter, session string, csrf string, username string) error {
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
		Path: "/",
	})

	http.SetCookie(w, &http.Cookie{
		Name: "csrf_token",
		Value: csrf,
		Expires: time.Now().Add(d),
		HttpOnly: false,
		Path: "/",
	})

	http.SetCookie(w, &http.Cookie{
		Name: "username",
		Value: username,
		Expires: time.Now().Add(d),
		HttpOnly: true,
		Path: "/",
	})

	return nil
}

func VerifyTokens(session string, csrf string, sessionHash string, csrfHash string) bool{
	sessionMatch := false
	csrfMatch := false

	if err := bcrypt.CompareHashAndPassword([]byte(sessionHash), []byte(session)); err == nil{
		sessionMatch = true
	}

	if err := bcrypt.CompareHashAndPassword([]byte(csrfHash), []byte(csrf)); err == nil{
		csrfMatch = true
	}

	return sessionMatch && csrfMatch
}

func UserLogin(w http.ResponseWriter, username string, db *sql.DB, uid string){
	sessionToken := GenerateToken(32)
	csrfToken := GenerateToken(32)

	err := models.SaveTokens(db, sessionToken, csrfToken, uid)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = setCookies(w, sessionToken, csrfToken, username)
	if err != nil{
		log.Println(err.Error())
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
