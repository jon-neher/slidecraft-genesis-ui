import { describe, expect, it } from '@jest/globals'
import Ajv from 'ajv/dist/2020'
import schema from '../../schemas/deck-blueprint.schema.json'
import blueprintMinimal from '../../examples/blueprint_minimal.json'
import blueprintFull from '../../examples/blueprint_full.json'

const ajv = new Ajv()
const validate = ajv.compile(schema)

describe('deck blueprint schema', () => {
  it('validates minimal blueprint', () => {
    const valid = validate(blueprintMinimal)
    expect(valid).toBe(true)
  })

  it('validates full blueprint', () => {
    const valid = validate(blueprintFull)
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
