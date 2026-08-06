// app/(authenticated)/communities/new/create-community-form.tsx
'use client'

import { createCommunity } from '@/app/actions/community'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Criando...' : 'Criar Comunidade'}
    </Button>
  )
}

export function CreateCommunityForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const router = useRouter()

  // Função para gerar slug amigável em português
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, '-')            // Espaços viram hifens
      .replace(/[^a-z0-9-]/g, '')      // Remove caracteres especiais
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setSlug(generateSlug(newName))
  }

  async function handleSubmit(formData: FormData) {
    const result = await createCommunity(formData)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.slug) {
      toast.success('Comunidade criada com sucesso! Redirecionando...')
      router.push(`/c/${result.slug}`) // Redireciona para a página da comunidade
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Comunidade</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Ecovila Terra Nova"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL (Slug)</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="ecovila-terra-nova"
          value={slug}
          onChange={(e) => setSlug(generateSlug(e.target.value))}
          required
        />
        <p className="text-xs text-muted-foreground">
          Este será o link da sua comunidade: <span className="font-mono">plataforma.com/c/{slug || 'sua-comunidade'}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Fale um pouco sobre o propósito da comunidade..."
          rows={4}
        />
      </div>

      <SubmitButton />
    </form>
  )
}