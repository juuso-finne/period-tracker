package middleware

import (
	"net/http"
	"database/sql"
)

type Middleware func(http.Handler, *MiddlewareHandler) http.Handler

func CreateStack(h *MiddlewareHandler, xs ...Middleware) Middleware{
	return func(next http.Handler, h *MiddlewareHandler) http.Handler{
		for i := len(xs)-1; i >= 0; i--{
			x := xs[i]
			next = x(next, h)
		}

		return next
	}
}

type MiddlewareHandler struct{
	Db *sql.DB
}