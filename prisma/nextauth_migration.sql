-- Drop existing Clerk unique constraints and columns
ALTER TABLE "businesses" DROP COLUMN IF EXISTS "clerk_user_id";

-- Drop User clerk_user_id unique constraint and column
ALTER TABLE "users" DROP COLUMN IF EXISTS "clerk_user_id";

-- Alter User table to match NextAuth requirements
ALTER TABLE "users"
  ALTER COLUMN "id" TYPE VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "name" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "email_verified" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "image" VARCHAR(255),
  ALTER COLUMN "business_id" DROP NOT NULL,
  ALTER COLUMN "role" SET DATA TYPE VARCHAR(255),
  ALTER COLUMN "role" SET DEFAULT 'admin';

-- Drop the old UserRole enum type if needed (optional)
-- DROP TYPE IF EXISTS "UserRole";

-- Alter CredentialAccessLog to use user_id
ALTER TABLE "credential_access_logs"
  RENAME COLUMN "clerk_user_id" TO "user_id";

-- Create NextAuth adapter tables
CREATE TABLE IF NOT EXISTS "accounts" (
  "id" VARCHAR(255) NOT NULL,
  "user_id" VARCHAR(255) NOT NULL,
  "type" VARCHAR(255) NOT NULL,
  "provider" VARCHAR(255) NOT NULL,
  "provider_account_id" VARCHAR(255) NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" VARCHAR(255),
  "scope" VARCHAR(255),
  "id_token" TEXT,
  "session_state" VARCHAR(255),

  CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" VARCHAR(255) NOT NULL,
  "session_token" VARCHAR(255) NOT NULL,
  "user_id" VARCHAR(255) NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" VARCHAR(255) NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

-- Add indexes and constraints
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_session_token_key" ON "sessions"("session_token");
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_token_key" ON "verification_tokens"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- Add foreign keys
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "credential_access_logs" ADD CONSTRAINT "credential_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
