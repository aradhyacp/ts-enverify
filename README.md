# enverify

**Type-safe environment variable validation for Node.js.**  
Catch missing or malformed env vars at startup — before they silently break your app.

Zero dependencies. Works with any framework. Infers TypeScript types automatically.

[![npm version](https://img.shields.io/npm/v/enverify.svg)](https://www.npmjs.com/package/enverify)
[![license](https://img.shields.io/npm/l/enverify.svg)](./LICENSE)

---

## The Problem

```ts
const port = process.env.PORT   // string | undefined — not a number
const url  = process.env.DB_URL // undefined silently, no error thrown
```

`process.env` gives you strings or `undefined` — always. No types, no validation,
no warnings. A missing required variable only surfaces as a crash deep inside your
app, not at startup where it's easy to catch.

---

## Install

```bash
npm i enverify
```

---

## Usage

```ts
import { enverify } from 'enverify'

const env = enverify({
  DATABASE_URL: { type: 'string',  required: true },
  PORT:         { type: 'number',  default: 3000 },
  NODE_ENV:     { type: 'enum',    values: ['development', 'production', 'test'] as const, default: 'development' },
  ENABLE_CACHE: { type: 'boolean', default: false },
})

// Fully typed — no casting needed
env.DATABASE_URL  // string
env.PORT          // number  (not "string"!)
env.NODE_ENV      // "development" | "production" | "test"
env.ENABLE_CACHE  // boolean
```

Call `enverify()` at the top of your entry file, before anything else runs.
If validation fails, the process exits immediately with a clear message.

---

## Works with dotenv

```ts
import 'dotenv/config'       // load .env into process.env
import { enverify } from 'enverify'  // then validate it

const env = enverify({ ... })
```

---

## Supported Types

| Type      | Raw input accepted          | TypeScript output                    |
|-----------|-----------------------------|--------------------------------------|
| `string`  | any string                  | `string`                             |
| `number`  | `"3000"`, `"8.5"`           | `number`                             |
| `boolean` | `"true"` `"false"` `"1"` `"0"` | `boolean`                        |
| `enum`    | one of the declared values  | `"a" \| "b" \| "c"`                 |

---

## Field Options

```ts
// required — must be set, no fallback
DATABASE_URL: { type: 'string', required: true }

// default — optional, falls back to this value if not set
PORT: { type: 'number', default: 3000 }

// optional — not required, no default. Type will be string | undefined
HOST: { type: 'string' }

// enum — value must be one of the declared options
NODE_ENV: { type: 'enum', values: ['development', 'production', 'test'] as const }
```

---

## Error Messages

When validation fails, enverify throws **before your app starts** and
shows every problem at once — not just the first one:

```
✗ enverify validation failed:

  → DATABASE_URL: required but not set
  → PORT: expected a number, got "abc"
  → NODE_ENV: expected one of [development, production, test], got "prod"

Fix the above environment variables before starting the app.
```

---

## Custom Source

By default enverify reads from `process.env`. Pass a custom source for
testing or other use cases:

```ts
const env = enverify(schema, {
  source: { PORT: '8080', NODE_ENV: 'test' }
})
```

---

## Why not Zod?

Zod is a great general-purpose validator, but using it for env vars requires
wiring up `z.object()`, `.parse()`, and a custom coercion setup every time.
enverify is one focused tool that does exactly this job — no boilerplate,
no extra concepts, just a schema and a typed result.

---

## License

MIT — [aradhyacp](https://github.com/aradhyacp/enverify)