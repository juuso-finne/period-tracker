package types

type PeriodData struct{
	Id int `json:"id"`
	Start string `json:"start"`
	End any `json:"end"`
}

type LoginData struct{
	Username string `json:"username"`
	Password string `json:"password"`
}