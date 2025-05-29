CREATE TABLE IF NOT EXISTS "user_data" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "session_token" TEXT,
    "csrf_token" TEXT
);

CREATE TABLE IF NOT EXISTS "period_data"(
    "id" SERIAL PRIMARY KEY,
    "start" DATE NOT NULL,
    "end" DATE,
    "user_id" UUID NOT NULL,
    "notes" TEXT,
    FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "default_settings"(
    "user_id" UUID PRIMARY KEY,
    "use_defaults" BOOLEAN DEFAULT FALSE NOT NULL,
    "plus_minus" INT DEFAULT 3 NOT NULL,
    "cycle_length" INT DEFAULT 28 NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE CASCADE ON UPDATE CASCADE
);