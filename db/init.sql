CREATE TABLE IF NOT EXISTS "user_data" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "session_token" VARCHAR(32),
    "csrf_token" VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS "period_data"(
    "id" SERIAL PRIMARY KEY,
    "start" DATE NOT NULL,
    "end" DATE,
    "user_id" UUID NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "default_settings"(
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID NOT NULL,
    "plus_minus" INT NOT NULL,
    "cycle_length" INT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE CASCADE ON UPDATE CASCADE
);