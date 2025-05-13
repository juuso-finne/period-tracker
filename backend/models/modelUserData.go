package models

import(
	"database/sql"
	"backend/types"
	"golang.org/x/crypto/bcrypt"
)

func AddUserData(db *sql.DB, data *types.LoginData) error{
	hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), 10)
	if err != nil{
		return err
	}

	query := `
		INSERT INTO user_data (username, password)
		VALUES ($1, $2)
	`
	_, err = db.Exec(query, data.Username, hash)
	if err != nil{
		return err
	}

	return nil
}

func GetUserData(db *sql.DB, username string) (*types.CompleteUserData, error){
	query := `
		SELECT id, username, password, session_token, csrf_token
		FROM user_data
		WHERE username = $1
	`
	var d types.CompleteUserData
	err := db.QueryRow(query, username).Scan(&d.Id, &d.Username, &d.Password, &d.Session, &d.Csrf)
	if err != nil{
		return nil, err
	}

	return &d, nil
}