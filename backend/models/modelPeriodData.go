package models

import(
	"database/sql"
	"backend/types"
)

func GetPeriodData(db *sql.DB, uid string) ([]types.PeriodData, error){
	query := `
	    SELECT id, start, "end", notes
	    FROM period_data
	    WHERE user_id = $1
	    ORDER BY start DESC
    `

	rows, err := db.Query(query, uid)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

	var periods []types.PeriodData
    for rows.Next() {
        var p types.PeriodData
        err := rows.Scan(&p.Id, &p.Start, &p.End, &p.Notes)
        if err != nil {
            return nil, err
        }
        periods = append(periods, p)
    }

    if err = rows.Err(); err != nil {
        return nil, err
    }

    return periods, nil
}

func PostPeriodData(db *sql.DB, data *types.PeriodData, uid string) error{
    query := `
        INSERT INTO period_data (user_id, start, "end", notes)
        VALUES ($1, $2, $3, $4)
    `
    _, err := db.Exec(query, uid, data.Start, data.End, data.Notes)
    return err
}

func EditPeriodData(db *sql.DB, data *types.PeriodData) error{
    query := `
        UPDATE period_data
        SET start = $1, "end" = $2, notes = $3
        WHERE id = $4
    `
    _, err := db.Exec(query, data.Start, data.End, data.Notes, data.Id)
    return err
}

func DeletePeriodData(db *sql.DB, id int) error{
    query := `
        DELETE FROM period_data
        WHERE id = $1
    `
    _, err := db.Exec(query, id)
    return err
}

func GetPeriodDataOwner(db *sql.DB, id int) (*string, error){
    query := `
        SELECT user_id
        FROM period_data
        WHERE id = $1
    `
    var owner string
    err := db.QueryRow(query, id).Scan(&owner)
    if err != nil {
        return nil, err
    }
    return &owner, nil
}