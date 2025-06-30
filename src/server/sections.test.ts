
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let generateSections: typeof import('./sections').generateSections

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn() as jest.MockedFunction<any>
    }
  }
}

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => mockOpenAI),
  OpenAI: jest.fn(() => mockOpenAI)
}))

beforeAll(async () => {
  ;({ generateSections } = await import('./sections'))
})

describe('generateSections', () => {
  beforeEach(() => {
    mockOpenAI.chat.completions.create.mockClear()
  })

  it('generates sections with valid response', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '["intro", "problem", "solution"]' } }]
    })

    const result = await generateSections('Test goal', 'Test audience', false)
    expect(result.sections).toEqual(['intro', 'problem', 'solution'])
  })

  it('handles invalid JSON response', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'invalid json' } }]
    })

    const result = await generateSections('Test goal', 'Test audience', false)
    expect(result.sections).toEqual([
      'intro',
      'context',
      'analysis',
      'recommendation',
      'q_and_a'
    ])
  })
})
