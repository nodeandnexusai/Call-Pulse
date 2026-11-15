-- Add verify_token and updated_at columns to integration_credentials table
-- Run this migration against your Supabase/PostgreSQL database

ALTER TABLE "integration_credentials"
  ADD COLUMN IF NOT EXISTS "verify_token" TEXT,
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3);
