import { getUsuarioById, getLocales } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Store, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UsuarioPerfilPage({ params }: PageProps) {
  const { id } = await params;
  const usuario = await getUsuarioById(id);

  if (!usuario) {
    notFound();
  }

  // Obtener locales del usuario si es propietario
  let localesDelUsuario: Awaited<ReturnType<typeof getLocales>> = [];
  if (usuario.rol === "propietario" && usuario.locales_propios.length > 0) {
    const todosLocales = await getLocales();
    localesDelUsuario = todosLocales.filter((local) =>
      usuario.locales_propios.includes(local._id)
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón de regreso */}
      <Link href="/usuarios">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a usuarios
        </Button>
      </Link>

      {/* Cabecera del perfil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={usuario.foto_perfil} alt={usuario.nombre} />
              <AvatarFallback className="text-3xl">
                {usuario.nombre.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {usuario.nombre}
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  @{usuario.usuario}
                </p>
                <div className="mt-3">
                  <Badge
                    variant={usuario.rol === "propietario" ? "default" : "secondary"}
                    className="capitalize text-sm"
                  >
                    {usuario.rol}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{usuario.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Registrado el {formatDate(usuario.fecha_registro)}</span>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de locales si es propietario */}
      {usuario.rol === "propietario" && localesDelUsuario.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Locales de {usuario.nombre.split(" ")[0]}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {localesDelUsuario.map((local) => (
              <Link key={local._id} href={`/locales/${local._id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">{local.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {local.descripcion}
                    </p>
                    <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <p>{local.direccion.distrito}</p>
                        <p>
                          {local.direccion.ciudad}, {local.direccion.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t">
                      <span>{local.publicaciones.length} publicaciones</span>
                      <span>{local.reseñas.length} reseñas</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si es propietario pero no tiene locales */}
      {usuario.rol === "propietario" && localesDelUsuario.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Store className="h-12 w-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" />
            <p className="text-zinc-600 dark:text-zinc-400">
              Este usuario aún no tiene locales registrados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mensaje si es cliente */}
      {usuario.rol === "cliente" && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Este usuario es un cliente de la plataforma.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
