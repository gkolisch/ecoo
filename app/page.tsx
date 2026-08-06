'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoutButton } from '@/components/logout-button';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 1. Tenta pegar o usuário atual imediatamente
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // 2. O PULO DO GATO: Escuta mudanças de autenticação.
    // Se o cookie demorar alguns milissegundos para ser lido após o login,
    // este listener detecta a sessão automaticamente e atualiza a tela.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-8">
        <Card className="mx-auto mt-16 max-w-md">
          <CardHeader>
            <CardTitle>Plataforma Comunidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Você ainda não está logado.
            </p>
            <Link href="/login">
              <Button className="w-full">Ir para o login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <Card className="mx-auto mt-16 max-w-md">
        <CardHeader>
          <CardTitle>Plataforma Comunidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant="secondary">Logado como {user.email}</Badge>
          <p className="text-sm text-muted-foreground">
            Login com Google funcionando! Seu perfil foi criado no banco.
          </p>

          <div className="space-y-2 pt-4">
            <h3 className="text-sm font-semibold">O que você quer fazer?</h3>
            <Link href="/communities/new" className="block">
              <Button className="w-full" variant="default">
                Criar uma nova comunidade
              </Button>
            </Link>
            <Link href="/communities/join" className="block">
              <Button className="w-full" variant="outline">
                Entrar em uma comunidade existente
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}