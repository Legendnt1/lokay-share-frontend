import { getLocales } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, User } from "lucide-react";
import Link from "next/link";

export default async function LocalesPage() {
  const locales = await getLocales();

  const calcularPromedioReseñas = (reseñas: typeof locales[0]["reseñas"]) => {
    if (reseñas.length === 0) return 0;
    const suma = reseñas.reduce((acc, r) => acc + r.calificacion, 0);
    return (suma / reseñas.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Locales
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Explora todos los locales disponibles
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {locales.map((local) => (
          <Card
            key={local._id}
            className="flex flex-col hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-xl">{local.nombre}</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2">
                {local.descripcion}
              </p>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Ubicación */}
              <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {local.direccion.distrito}, {local.direccion.ciudad}
                </span>
              </div>

              {/* Horarios */}
              <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{local.horarios}</span>
              </div>

              {/* Propietario */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 shrink-0 text-zinc-600 dark:text-zinc-400" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={local.id_propietario.foto_perfil}
                      alt={local.id_propietario.nombre}
                    />
                    <AvatarFallback className="text-xs">
                      {local.id_propietario.nombre.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/usuarios/${local.id_propietario._id}`}
                    className="text-zinc-900 dark:text-white hover:underline"
                  >
                    {local.id_propietario.nombre}
                  </Link>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    @{local.id_propietario.usuario}
                  </span>
                </div>
              </div>

              {/* Calificación */}
              {local.reseñas.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {calcularPromedioReseñas(local.reseñas)}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    ({local.reseñas.length}{" "}
                    {local.reseñas.length === 1 ? "reseña" : "reseñas"})
                  </span>
                </div>
              )}

              {/* Botón de detalles */}
              <div className="pt-4 border-t">
                <Link href={`/locales/${local._id}`} className="block">
                  <Button className="w-full" variant="default">
                    Ver detalles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locales.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No hay locales disponibles en este momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
