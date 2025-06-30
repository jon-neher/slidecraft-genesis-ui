import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Blueprint {
  blueprint_id: string
  name: string
  is_default: boolean
  data: { section_sequence?: { value: string[] } }
}

const BlueprintWizard = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [catalog, setCatalog] = useState<Blueprint[]>([])
  const [selected, setSelected] = useState<Blueprint | null>(null)
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [sections, setSections] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (step === 0) {
      fetch('/api/blueprints?includeDefaults=true')
        .then(r => r.json())
        .then(setCatalog)
        .catch(err => console.error('Fetch catalog error:', err))
    }
  }, [step])

  const handleImport = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`/api/blueprints/${selected.blueprint_id}/clone`, { method: 'POST' })
      const json = await res.json()
      setSelected(json)
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sections/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, audience }),
      })
      const json = await res.json()
      setSections(json.sections || [])
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await fetch(`/api/blueprints/${selected.blueprint_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selected.name,
          data: { goal, audience, section_sequence: sections },
        }),
      })
      navigate('/dashboard')
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
            {catalog.map(bp => (
              <Button
                key={bp.blueprint_id}
                variant={selected?.blueprint_id === bp.blueprint_id ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelected(bp)}
              >
                {bp.name}
              </Button>
            ))}
            <div className="flex justify-end pt-4">
              <Button disabled={!selected || loading} onClick={handleImport}>
                Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Goal and Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Goal" value={goal} onChange={e => setGoal(e.target.value)} />
            <Input placeholder="Audience" value={audience} onChange={e => setAudience(e.target.value)} />
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={handleSuggest} disabled={!goal || !audience || loading}>
                Generate Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Outline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              {sections.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSave} disabled={!sections.length || loading}>
                Save Blueprint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BlueprintWizard
