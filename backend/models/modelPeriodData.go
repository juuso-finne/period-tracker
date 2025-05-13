package models

import(
	"database/sql"
	"backend/types"
)

func GetPeriodData(db *sql.DB, uid string) ([]types.PeriodData, error){
	query := `
	SELECT id, start, "end"
	FROM period_data
	WHERE user_id = $1
	ORDER BY start DESC`

	rows, err := db.Query(query, uid)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

	var periods []types.PeriodData
    for rows.Next() {
        var p types.PeriodData
        err := rows.Scan(&p.Id, &p.Start, &p.End)
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