
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { generateSections } from './sections'

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
}

jest.doMock('openai', () => ({
  OpenAI: jest.fn(() => mockOpenAI)
}))

describe('generateSections', () => {
  beforeEach(() => {
    mockOpenAI.chat.completions.create.mockClear()
  })

  it('generates sections with valid response', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: '["intro", "problem", "solution"]' } }]
    } as any)

    const result = await generateSections('Test goal', 'Test audience', false)
    expect(result.sections).toEqual(['intro', 'problem', 'solution'])
  })

  it('handles invalid JSON response', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'invalid json' } }]
    } as any)

    await expect(generateSections('Test goal', 'Test audience', false))
      .rejects.toThrow('Failed to parse OpenAI response')
  })
})
