# ts-enverify

**Type-safe environment variable validation for Node.js.**  
Catch missing or malformed env vars at startup — before they silently break your app.

Zero dependencies. Works with any framework. Infers TypeScript types automatically.

![banner](ts-enverify.png)

[![npm version](https://img.shields.io/npm/v/ts-enverify.svg)](https://www.npmjs.com/package/ts-enverify)
[![license](https://img.shields.io/npm/l/ts-enverify.svg)](./LICENSE)

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
npm i ts-enverify
```

---

## Usage

```ts
import { enverify } from 'ts-enverify'

const env = enverify({
  APP_NAME:     { type: 'string', required: true },
  MAX_RETRIES:  { type: 'number', default: 3 },
  PORT:         { type: 'port', default: 3000 },
  ENABLE_CACHE: { type: 'boolean', default: false },
  NODE_ENV:     { type: 'enum', values: ['development', 'production', 'test'] as const },
  API_BASE_URL: { type: 'url', required: true },
})

```
Resulting types:

| Property | Type |
| --- | --- |
| `env.APP_NAME` | `string` |
| `env.MAX_RETRIES` | `number` |
| `env.PORT` | `number` |
| `env.ENABLE_CACHE` | `boolean` |
| `env.NODE_ENV` | `"development" "production"  "test"` |
| `env.API_BASE_URL` | `string` |

Example env values:

```text
APP_NAME="my-service"
MAX_RETRIES="5"
PORT="8080"
ENABLE_CACHE="true"
NODE_ENV="production"
API_BASE_URL="https://api.example.com"
```
Call `enverify()` at the top of your entry file, before anything else runs.
If validation fails, the process exits immediately with a clear message.

---

## Works with dotenv

```ts
import 'dotenv/config'       // load .env into process.env
import { enverify } from 'ts-enverify'  // then validate it

const env = enverify({ ... })
```

---

## Supported Types

| Type      | Raw input accepted          | TypeScript output                    |
|-----------|-----------------------------|--------------------------------------|
| `string`  | any string                  | `string`                             |
| `number`  | `"3000"`, `"8.5"`           | `number`                             |
| `port`    | `"1"` to `"65535"` (integers only) | `number`                     |
| `boolean` | `"true"` `"false"` `"1"` `"0"` | `boolean`                        |
| `enum`    | one of the declared values  | `"a" \| "b" \| "c"`                 |
| `url`     | any valid URL string        | `string` (normalized via `URL`)      |

URL values are parsed with `new URL(raw)` and returned as `toString()`,
so `https://example.com` becomes `https://example.com/`.

---

## Field Options

Each field supports the options below. `values` is required for `enum`.

- `type`: one of `string`, `number`, `port`, `boolean`, `enum`, `url`
- `required`: marks the field as required (no fallback unless `default` is set)
- `default`: fallback value when the env var is missing
- `description`: optional metadata for docs/tooltips (ignored by runtime)
- `values`: list of allowed values for `enum` fields

```ts
// required — must be set, no fallback
DATABASE_URL: { type: 'url', required: true, description: 'The main database URL' }

// default — optional, falls back to this value if not set
PORT: { type: 'port', default: 3000, description: 'Port for the server to listen on' }

// description — optional metadata for docs/tooltips (ignored by runtime)
HOST: { type: 'string', description: 'Sets the default host' }

// optional — not required, no default. Type will be string | undefined
API_KEY: { type: 'string' }

// enum — value must be one of the declared options
NODE_ENV: { type: 'enum', values: ['development', 'production', 'test'] as const }

// url — value must be a valid URL and is returned normalized
API_BASE_URL: { type: 'url', required: true }
```

---

## Error Messages

When validation fails, enverify throws **before your app starts** and
shows every problem at once — not just the first one:

```
✗ ts-enverify validation failed:

  → DATABASE_URL: required but not set
  → PORT: expected a port number, got "abc"
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

The `source` object should contain only string values (or `undefined`),
matching the shape of `process.env`.

---

## Why not Zod?

Zod is a great general-purpose validator, but using it for env vars requires
wiring up `z.object()`, `.parse()`, and a custom coercion setup every time.
ts-enverify gives you one focused tool for this exact job — the `enverify`
function — with no boilerplate and a typed result.

---

## License

MIT — [aradhyacp](https://github.com/aradhyacp/ts-enverify)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, testing, and pull request guidelines.
