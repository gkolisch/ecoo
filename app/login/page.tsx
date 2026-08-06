'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen p-8">
      <Card className="mx-auto mt-16 max-w-md">
        <CardHeader>
          <CardTitle>Entrar na Plataforma Comunidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use sua conta Google para entrar. Sem senhas para decorar.
          </p>
          <Button className="w-full" onClick={handleGoogleLogin}>
            Entrar com Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
