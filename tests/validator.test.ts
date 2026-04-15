import { describe, it, expect } from 'vitest'
import { enverify } from '../src/index'
import { EnverifyError } from '../src/errors'

// We always pass a custom `source` in tests
// Never touch real process.env in tests — that's unpredictable

describe('string fields', () => {
  it('passes when a required string is present', () => {
    const env = enverify(
      { DATABASE_URL: { type: 'string', required: true } },
      { source: { DATABASE_URL: 'postgres://localhost/db' } }
    )
    expect(env.DATABASE_URL).toBe('postgres://localhost/db')
  })

  it('throws when a required string is missing', () => {
    expect(() =>
      enverify(
        { DATABASE_URL: { type: 'string', required: true } },
        { source: {} }
      )
    ).toThrow(EnverifyError)
  })

  it('uses the default when value is absent', () => {
    const env = enverify(
      { HOST: { type: 'string', default: 'localhost' } },
      { source: {} }
    )
    expect(env.HOST).toBe('localhost')
  })
})

describe('number fields', () => {
  it('parses a valid number string', () => {
    const env = enverify(
      { PORT: { type: 'number', default: 3000 } },
      { source: { PORT: '8080' } }
    )
    expect(env.PORT).toBe(8080)
    expect(typeof env.PORT).toBe('number')  // not "string"!
  })

  it('throws for a non-numeric value', () => {
    expect(() =>
      enverify(
        { PORT: { type: 'number', required: true } },
        { source: { PORT: 'abc' } }
      )
    ).toThrow(EnverifyError)
  })

  it('uses numeric default when absent', () => {
    const env = enverify(
      { PORT: { type: 'number', default: 3000 } },
      { source: {} }
    )
    expect(env.PORT).toBe(3000)
  })
})

describe('boolean fields', () => {
  it.each([
    ['true', true],
    ['1', true],
    ['false', false],
    ['0', false],
  ])('parses "%s" as %s', (raw, expected) => {
    const env = enverify(
      { ENABLE_CACHE: { type: 'boolean', default: false } },
      { source: { ENABLE_CACHE: raw } }
    )
    expect(env.ENABLE_CACHE).toBe(expected)
  })

  it('throws for an invalid boolean string', () => {
    expect(() =>
      enverify(
        { ENABLE_CACHE: { type: 'boolean', required: true } },
        { source: { ENABLE_CACHE: 'yes' } }
      )
    ).toThrow(EnverifyError)
  })
})

describe('enum fields', () => {
  const schema = {
    NODE_ENV: {
      type: 'enum' as const,
      values: ['development', 'production', 'test'] as const,
      default: 'development'
    }
  }

  it('passes with a valid enum value', () => {
    const env = enverify(schema, { source: { NODE_ENV: 'production' } })
    expect(env.NODE_ENV).toBe('production')
  })

  it('throws for a value not in the enum', () => {
    expect(() =>
      enverify(schema, { source: { NODE_ENV: 'prod' } })
    ).toThrow(EnverifyError)
  })
})

describe('error collection', () => {
  it('collects ALL errors at once, not just the first', () => {
    try {
      enverify(
        {
          DATABASE_URL: { type: 'string', required: true },
          PORT:         { type: 'number', required: true },
        },
        { source: {} }   // both missing
      )
    } catch (err) {
      expect(err).toBeInstanceOf(EnverifyError)
      const e = err as EnverifyError
      expect(e.failures).toHaveLength(2)
      expect(e.failures[0]).toContain('DATABASE_URL')
      expect(e.failures[1]).toContain('PORT')
    }
  })
})