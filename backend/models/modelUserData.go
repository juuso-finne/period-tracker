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