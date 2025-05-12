package main

type PeriodData struct{
	Id int `json:"id"`
	Start string `json:"start"`
	End string `json:"end"`
	UserId int `json:"user_id"`
}