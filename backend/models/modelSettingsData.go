package models

import (
	"database/sql"
	"backend/types"
)

func AddSettingsData(db *sql.DB, username string) error{
		queryGetUUID := `
		SELECT id
		FROM user_data
		WHERE username = $1
	`

	var uid string
	err := db.QueryRow(queryGetUUID, username).Scan(&uid)
	if err != nil{
		return err
	}

	queryCreateSettings := `
		INSERT INTO default_settings (user_id)
		VALUES ($1)
	`
	_, err = db.Exec(queryCreateSettings, uid)
	return err
}

func EditSettingsData(db *sql.DB, data *types.SettingsData, uid string) error{
	query := `
		UPDATE default_settings
		SET plus_minus = $1, cycle_length = $2
		WHERE user_id = $3
	`
	_, err := db.Exec(query, data.PlusMinus, data.CycleLength, uid)
	return err
}

func GetSettingsData(db *sql.DB, uid string) (*types.SettingsData, error){
	query := `
		SELECT plus_minus, cycle_length
		FROM default_settings
		WHERE user_id = $1
	`
	var data types.SettingsData
	err := db.QueryRow(query, uid).Scan(&data.PlusMinus, &data.CycleLength)
	if err != nil{
		return nil, err
	}
	return &data, nil
}