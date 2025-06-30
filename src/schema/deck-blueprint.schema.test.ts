import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from '@jest/globals'
import Ajv from 'ajv/dist/2020'

const ajv = new Ajv()
const schema = JSON.parse(readFileSync(join(__dirname, '../../schemas/deck-blueprint.schema.json'), 'utf-8'))
const validate = ajv.compile(schema)

describe('deck blueprint schema', () => {
  it('validates minimal blueprint', () => {
    const data = JSON.parse(readFileSync(join(__dirname, '../../examples/blueprint_minimal.json'), 'utf-8'))
    const valid = validate(data)
    expect(valid).toBe(true)
  })

  it('validates full blueprint', () => {
    const data = JSON.parse(readFileSync(join(__dirname, '../../examples/blueprint_full.json'), 'utf-8'))
    const valid = validate(data)
    expect(valid).toBe(true)
  })

  it('rejects deprecated fields', () => {
    const data = {
      goal: { value: 'foo', selection_source: 'user', overrideable: false },
      audience: { value: 'bar', selection_source: 'user', overrideable: false }
    }
    const valid = validate(data)
    expect(valid).toBe(false)
  })
})
