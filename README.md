# Period tracking app

## Intro

This app helps keep track of menstrual cycles and attempts to predict next period and ovulation based on previous cycles.

The frontend is a React app that is connected to a PostgreSQL database via REST API implemented in Go.

##  Running and installing locally

1. Copy the following into .env file in the **root directory** of the project and fill in the blanks

```
# .env

# Do NOT change these:
VITE_SERVER="http://localhost"
FRONTEND_URL="http://localhost"
IN_DOCKER="true"
DB_ADDRESS="db:5432"


# These can be changed if you want
# (The pre-defined values are suggestions):

POSTGRES_DB="periods"
VITE_BACKEND_PORT="5000"
TOKEN_EXPIRATION="48h"
COMPOSE_PROJECT_NAME="period-tracker"
FRONTEND_PORT="80"

# This you should set yourself
POSTGRES_PASSWORD=

```


2. In the root directory, run
```
docker-compose up -d
```

3. Open
```
http://localhost:{FRONTEND_PORT}
```
in your web browser ([http://localhost](http://localhost) if you kept the default)