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

	err = AddSettingsData(db, data.Username)
	return err
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

func SaveTokens(db *sql.DB, session string, csrf string, uid string) error{
	query := `
		UPDATE user_data
		SET session_token = $1, csrf_token = $2
		WHERE id = $3
	`

	stHash, err := bcrypt.GenerateFromPassword([]byte(session), 10)
	if err != nil{
		return err
	}

	csrfHash, err := bcrypt.GenerateFromPassword([]byte(csrf), 10)
	if err != nil{
		return err
	}

	_, err = db.Exec(query, stHash, csrfHash, uid)

	return err
}

func ClearTokens(db *sql.DB, uid string) error{
	query := `
		UPDATE user_data
		SET session_token = NULL, csrf_token = NULL
		WHERE id = $1
	`

	_, err := db.Exec(query, uid)

	return err
}

func DeleteUser(db *sql.DB, uid string) error{
	query := `
		DELETE FROM user_data
		WHERE id = $1
	`

	_, err := db.Exec(query, uid)

	return err
}

func UserExists(db *sql.DB, username string)(bool, error){
	query := `
		SELECT COUNT(*)
		FROM user_data
		WHERE username = $1
	`
	var count int
	err := db.QueryRow(query, username).Scan(&count)
	if err != nil{
		return false, err
	}

	return count != 0, nil
}