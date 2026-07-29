import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres.aiikhrimtojujrknhfeu:saadmalik%2F383@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  },
});