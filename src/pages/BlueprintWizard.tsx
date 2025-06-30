import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface BlueprintSummary {
  blueprint_id: string
  name: string
  is_default: boolean
}

const BlueprintWizard = () => {
  const [step, setStep] = useState(0)
  const [catalog, setCatalog] = useState<BlueprintSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [blueprintId, setBlueprintId] = useState<string | null>(null)
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [outline, setOutline] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step === 0 && catalog.length === 0) {
      fetch('/api/blueprints?includeDefaults=true')
        .then(res => res.json())
        .then(setCatalog)
        .catch(err => console.error('Fetch catalog error:', err))
    }
  }, [step, catalog.length])

  const handleImport = async () => {
    if (!selectedId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/blueprints/${selectedId}/clone`, { method: 'POST' })
      const data = await res.json()
      setBlueprintId(data.blueprint_id)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    if (!blueprintId) return
    setLoading(true)
    try {
      const res = await fetch('/api/sections/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blueprintId, goal, audience }),
      })
      const data = await res.json()
      setOutline(JSON.stringify(data, null, 2))
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!blueprintId) return
    setLoading(true)
    try {
      await fetch(`/api/blueprints/${blueprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'My Blueprint',
          data: { goal, audience, section_sequence: JSON.parse(outline) },
        }),
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ice-white p-6 space-y-6">
      {step === 0 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Select a Blueprint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {catalog.map(b => (
              <Button
                key={b.blueprint_id}
                variant={selectedId === b.blueprint_id ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedId(b.blueprint_id)}
              >
                {b.name}
              </Button>
            ))}
            <div className="flex justify-end pt-4">
              <Button disabled={!selectedId || loading} onClick={handleImport}>
                Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Describe Your Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Goal" value={goal} onChange={e => setGoal(e.target.value)} />
            <Input placeholder="Audience" value={audience} onChange={e => setAudience(e.target.value)} />
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button disabled={!goal || !audience || loading} onClick={handleSuggest}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>AI Outline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea className="h-40" value={outline} onChange={e => setOutline(e.target.value)} />
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!outline || loading} onClick={handleSave}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Blueprint Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-gray">Your blueprint has been saved.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BlueprintWizard
