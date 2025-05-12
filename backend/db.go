package main

import(
	"strings"
	"os"
	"database/sql"
	_ "github.com/lib/pq"
)

func connectToDB() (*sql.DB, error){
	var sb strings.Builder
	sb.WriteString("postgres://postgres:")
	sb.WriteString(os.Getenv("POSTGRES_PASSWORD"))
	sb.WriteString("@")
	sb.WriteString(os.Getenv("DB_ADDRESS"))
	sb.WriteString("/")
	sb.WriteString(os.Getenv("POSTGRES_DB"))
	sb.WriteString("?sslmode=disable")

	dbUrl := sb.String()
	db, err := sql.Open("postgres", dbUrl)

	return db, err
}



