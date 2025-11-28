import { getUsuarios } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Store } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Usuarios
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Descubre a todos los usuarios de la comunidad
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((usuario) => (
          <Link key={usuario._id} href={`/usuarios/${usuario._id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={usuario.foto_perfil} alt={usuario.nombre} />
                    <AvatarFallback className="text-lg">
                      {usuario.nombre.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-white truncate">
                      {usuario.nombre}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                      @{usuario.usuario}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={usuario.rol === "propietario" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {usuario.rol}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{usuario.email}</span>
                </div>
                {usuario.rol === "propietario" && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Store className="h-4 w-4 shrink-0" />
                    <span>
                      {usuario.locales_propios.length}{" "}
                      {usuario.locales_propios.length === 1 ? "local" : "locales"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
