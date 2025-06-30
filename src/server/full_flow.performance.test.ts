
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals';

let generateSections: typeof import('./sections').generateSections
let createBlueprint: typeof import('./blueprints').createBlueprint
let getUserBlueprints: typeof import('./blueprints').getUserBlueprints

const mockBuilder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  insert: jest.fn() as jest.MockedFunction<any>,
  maybeSingle: jest.fn() as jest.MockedFunction<any>,
  single: jest.fn() as jest.MockedFunction<any>,
}

const mockAuthBuilder = {
  getUser: jest.fn() as jest.MockedFunction<any>,
}

const mockSupabase = {
  from: jest.fn(() => mockBuilder),
  auth: mockAuthBuilder,
}

const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn() as jest.MockedFunction<any>
    }
  }
}

beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => mockSupabase),
  }))
  
  jest.doMock('openai', () => ({
    OpenAI: jest.fn(() => mockOpenAI)
  }))
  
  ;({ generateSections } = await import('./sections'))
  ;({ createBlueprint, getUserBlueprints } = await import('./blueprints'))
})

beforeEach(() => {
  jest.clearAllMocks()
  mockBuilder.select.mockReturnThis()
  mockBuilder.eq.mockReturnThis()
  mockBuilder.maybeSingle.mockResolvedValue({ data: null, error: null })
  mockBuilder.single.mockResolvedValue({ data: null, error: null })
  mockBuilder.insert.mockResolvedValue({ data: null, error: null })
  mockAuthBuilder.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
  mockOpenAI.chat.completions.create.mockResolvedValue({
    choices: [{ message: { content: '["intro", "problem", "solution"]' } }]
  })
})

describe('Full Flow Performance', () => {
  it('generates sections quickly', async () => {
    const start = Date.now()
    await generateSections('test goal', 'test audience', false)
    const duration = Date.now() - start
    expect(duration).toBeLessThan(5000)
  })

  it('creates blueprint efficiently', async () => {
    mockBuilder.insert.mockResolvedValue({ 
      data: { 
        blueprint_id: 'bp1', 
        user_id: 'test-user', 
        name: 'Test', 
        is_default: false, 
        goal: 'test', 
        audience: 'test', 
        section_sequence: ['intro'], 
        theme: 'default', 
        slide_library: [], 
        extra_metadata: {} 
      }, 
      error: null 
    })

    const start = Date.now()
    await createBlueprint({
      name: 'Test Blueprint',
      goal: 'Test goal',
      audience: 'Test audience',
      section_sequence: ['intro', 'solution'],
      theme: 'default'
    }, 'test-user')
    const duration = Date.now() - start
    expect(duration).toBeLessThan(2000)
  })

  it('retrieves blueprints quickly', async () => {
    mockBuilder.select.mockResolvedValue({ data: [], error: null })

    const start = Date.now()
    await getUserBlueprints('test-user')
    const duration = Date.now() - start
    expect(duration).toBeLessThan(1000)
  })
})
