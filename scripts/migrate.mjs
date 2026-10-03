#!/usr/bin/env node
/**
 * Applies every .sql file in supabase/migrations to the Supabase database, in
 * filename order, exactly once. Already-applied files are skipped.
 *
 *   npm run db:push
 *
 * Requires SUPABASE_DB_URL in .env.local — the connection string from
 * Supabase → Project Settings → Database → Connection string → URI.
 */
import { lookup, resolve6 } from "node:dns/promises"
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const migrationsDir = join(root, "supabase", "migrations")

function loadEnv() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8")
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, value] = match
      if (!process.env[key]) {
        process.env[key] = value.replace(/^["']|["']$/g, "")
      }
    }
  } catch {
    // No .env.local is fine when the variable comes from the real environment.
  }
}

loadEnv()

const connectionString = process.env.SUPABASE_DB_URL
if (!connectionString) {
  console.error(
    [
      "",
      "  SUPABASE_DB_URL is not set.",
      "",
      "  Add it to .env.local (the file is git-ignored):",
      "",
      '    SUPABASE_DB_URL="postgresql://postgres.<ref>:<password>@<host>:5432/postgres"',
      "",
      "  Find it in Supabase → Project Settings → Database → Connection string → URI,",
      "  and replace [YOUR-PASSWORD] with your database password.",
      "",
    ].join("\n")
  )
  process.exit(1)
}

// Supabase direct hosts are often IPv6-only. Windows getaddrinfo then
// returns ENOTFOUND even though an AAAA record exists. pg still resolves the
// hostname inside a connection string, so pass the address as `host`.
const dbUrl = new URL(connectionString)
let host = dbUrl.hostname
try {
  await lookup(dbUrl.hostname)
} catch {
  const [addr] = await resolve6(dbUrl.hostname)
  host = addr
}

const client = new pg.Client({
  host,
  port: Number(dbUrl.port || 5432),
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ""),
  ssl: { rejectUnauthorized: false },
})

async function main() {
  await client.connect()

  await client.query(`
    create table if not exists public.schema_migrations (
      filename    text primary key,
      applied_at  timestamptz not null default now()
    );
  `)

  const { rows } = await client.query("select filename from public.schema_migrations")
  const applied = new Set(rows.map((r) => r.filename))

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort()

  const pending = files.filter((f) => !applied.has(f))

  if (pending.length === 0) {
    console.log(`Up to date — ${files.length} migration(s) already applied.`)
    return
  }

  for (const file of pending) {
    const sql = readFileSync(join(migrationsDir, file), "utf8")
    process.stdout.write(`Applying ${file} … `)
    try {
      // Each migration runs in its own transaction, so a failure leaves no partial state.
      await client.query("begin")
      await client.query(sql)
      await client.query("insert into public.schema_migrations (filename) values ($1)", [file])
      await client.query("commit")
      console.log("ok")
    } catch (error) {
      await client.query("rollback")
      console.log("FAILED")
      console.error(`\n  ${error.message}\n`)
      process.exitCode = 1
      return
    }
  }

  console.log(`\nApplied ${pending.length} migration(s).`)
}

main()
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(() => client.end())
