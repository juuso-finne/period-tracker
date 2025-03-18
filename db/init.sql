CREATE TABLE IF NOT EXISTS "user_data" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "period_data"(
    "id" SERIAL PRIMARY KEY,
    "start" DATE NOT NULL,
    "end" DATE,
    "user_id" INT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE CASCADE
);