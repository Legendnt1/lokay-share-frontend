import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, MapPin } from "lucide-react";
import type { Publicacion, Local } from "@/lib/api";

type FeedPostCardProps = {
  publicacion: Publicacion;
  local: Local;
};

export function FeedPostCard({ publicacion, local }: FeedPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage
                src={local.id_propietario.foto_perfil}
                alt={local.id_propietario.nombre}
              />
              <AvatarFallback>
                {local.id_propietario.nombre.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {local.id_propietario.nombre}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  @{local.id_propietario.usuario}
                </span>
              </div>
              <Link
                href={`/locales/${local._id}`}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {local.nombre}
              </Link>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {local.direccion.ciudad}, {local.direccion.region}
              </span>
            </div>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(publicacion.fecha)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Texto de la publicación */}
        <p className="text-sm text-zinc-900 dark:text-white whitespace-pre-wrap">
          {publicacion.texto}
        </p>

        {/* Imagen si existe */}
        {publicacion.url_imagen && (
          <div className="rounded-lg overflow-hidden relative w-full aspect-video">
            <Image
              src={publicacion.url_imagen}
              alt="Imagen de publicación"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Estadísticas (likes y comentarios) */}
        <div className="flex items-center gap-6 pt-2 border-t">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">{publicacion.likes}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {publicacion.comentarios.length}
            </span>
          </div>
        </div>

        {/* Últimos comentarios */}
        {publicacion.comentarios.length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
              Comentarios recientes
            </p>
            {publicacion.comentarios.slice(-2).map((comentario) => (
              <div key={comentario._id} className="flex gap-2">
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {comentario.usuario_nombre}
                    </span>{" "}
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {comentario.texto}
                    </span>
                  </p>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(comentario.fecha)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
