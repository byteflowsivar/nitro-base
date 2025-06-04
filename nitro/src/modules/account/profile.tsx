'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Profile() {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div>No se ha iniciado sesión</div>;
  }

  const { name, email, image } = session.user;
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image || ''} alt={name || 'Usuario'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="font-medium">{name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
