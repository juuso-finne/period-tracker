package types

type PeriodData struct{
	Id int `json:"id"`
	Start string `json:"start"`
	End any `json:"end"`
	Notes string `json:"notes"`
}

type LoginData struct{
	Username string `json:"username"`
	Password string `json:"password"`
}

type CompleteUserData struct{
	Id string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Session any `json:"session"`
	Csrf any `json:"csrf"`
}

type SettingsData struct{
	PlusMinus int `json:"plusMinus"`
	CycleLength int `json:"cycleLength"`

}

type ResourceOwnerIdExtractor func (resourceId int) (string, error)