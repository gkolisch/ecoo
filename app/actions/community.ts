// app/actions/community.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCommunity(formData: FormData) {
  const supabase = createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = (formData.get('description') as string) || ''

  if (!name || !slug) {
    return { error: 'Nome e URL (slug) são obrigatórios.' }
  }

  // ATENÇÃO: Verifique se os nomes dos parâmetros abaixo (name, slug, description) 
  // batem exatamente com os nomes que você definiu na sua função SQL no Supabase.
  // Se você usou prefixos como p_name, ajuste aqui para p_name: name.
  const { data, error } = await supabase.rpc('create_community', {
    p_name: name,
    p_slug: slug,
    p_description: description,
  })

  if (error) {
    // 23505 é o código de erro do Postgres para violação de UNIQUE (slug duplicado)
    if (error.code === '23505') {
      return { error: 'Esta URL (slug) já está em uso. Por favor, escolha outra.' }
    }
    console.error('Erro ao criar comunidade:', error)
    return { error: 'Ocorreu um erro ao criar a comunidade.' }
  }

  revalidatePath('/')
  return { success: true, slug: slug }
}