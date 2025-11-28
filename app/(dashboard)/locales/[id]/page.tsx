import { getLocalById } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Star,
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ReviewFormClient } from "./review-form-client";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LocalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const local = await getLocalById(id);

  if (!local) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calcularPromedioReseñas = () => {
    if (local.reseñas.length === 0) return 0;
    const suma = local.reseñas.reduce((acc, r) => acc + r.calificacion, 0);
    return (suma / local.reseñas.length).toFixed(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Botón de regreso */}
      <Link href="/locales">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a locales
        </Button>
      </Link>

      {/* Cabecera del local */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-3">{local.nombre}</CardTitle>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {local.descripcion}
                </p>
              </div>
              {local.lokayShopUrl && (
                <Link href={local.lokayShopUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver en Lokay Shop
                  </Button>
                </Link>
              )}
            </div>

            {/* Información de ubicación y horarios */}
            <div className="grid gap-3 md:grid-cols-2 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-zinc-600 dark:text-zinc-400" />
                  <div className="text-zinc-900 dark:text-white">
                    <p className="font-medium">{local.direccion.calle}</p>
                    <p>{local.direccion.distrito}, {local.direccion.ciudad}</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {local.direccion.region}, {local.direccion.pais}
                    </p>
                    {local.direccion.referencia && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Ref: {local.direccion.referencia}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="h-5 w-5 shrink-0 mt-0.5 text-zinc-600 dark:text-zinc-400" />
                  <div className="text-zinc-900 dark:text-white">
                    <p className="font-medium">Horarios</p>
                    <p>{local.horarios}</p>
                  </div>
                </div>

                {local.reseñas.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Star className="h-5 w-5 shrink-0 mt-0.5 fill-yellow-400 text-yellow-400" />
                    <div className="text-zinc-900 dark:text-white">
                      <p className="font-medium">
                        {calcularPromedioReseñas()} de 5
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {local.reseñas.length}{" "}
                        {local.reseñas.length === 1 ? "reseña" : "reseñas"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Información del propietario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Propietario</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={`/usuarios/${local.id_propietario._id}`}>
            <div className="flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 p-4 rounded-lg transition-colors">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={local.id_propietario.foto_perfil}
                  alt={local.id_propietario.nombre}
                />
                <AvatarFallback className="text-lg">
                  {local.id_propietario.nombre.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg text-zinc-900 dark:text-white">
                  {local.id_propietario.nombre}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  @{local.id_propietario.usuario}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {local.id_propietario.email}
                </p>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Publicaciones del local */}
      {local.publicaciones.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Publicaciones
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {local.publicaciones.length}{" "}
              {local.publicaciones.length === 1 ? "publicación" : "publicaciones"}
            </span>
          </div>

          <div className="space-y-4">
            {local.publicaciones.map((publicacion) => (
              <Card key={publicacion._id}>
                <CardContent className="pt-6 space-y-4">
                  {/* Cabecera de publicación con fecha */}
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm text-zinc-900 dark:text-white whitespace-pre-wrap flex-1">
                      {publicacion.texto}
                    </p>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
                      {formatDate(publicacion.fecha)}
                    </span>
                  </div>

                  {/* Imagen de la publicación */}
                  {publicacion.url_imagen && (
                    <div className="rounded-lg overflow-hidden relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={publicacion.url_imagen}
                        alt="Imagen de publicación"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  )}

                  {/* Estadísticas de interacción */}
                  <div className="flex items-center gap-6 pt-2 border-t">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{publicacion.likes}</span>
                      <span className="text-xs">
                        {publicacion.likes === 1 ? "like" : "likes"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {publicacion.comentarios.length}
                      </span>
                      <span className="text-xs">
                        {publicacion.comentarios.length === 1
                          ? "comentario"
                          : "comentarios"}
                      </span>
                    </div>
                  </div>

                  {/* Sección de comentarios */}
                  {publicacion.comentarios.length > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Comentarios
                      </p>
                      <div className="space-y-3">
                        {publicacion.comentarios.map((comentario) => (
                          <div
                            key={comentario._id}
                            className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {comentario.usuario_nombre}
                              </p>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
                                {formatDate(comentario.fecha)}
                              </span>
                            </div>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              {comentario.texto}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reseñas del local */}
      <ReviewFormClient localId={local._id} />

      {local.reseñas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Reseñas
            </h2>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                {calcularPromedioReseñas()}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                ({local.reseñas.length})
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {local.reseñas.map((reseña) => (
              <Card key={reseña._id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-base text-zinc-900 dark:text-white">
                        {reseña.usuario_nombre}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < reseña.calificacion
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-zinc-300 dark:text-zinc-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-zinc-900 dark:text-white">
                          {reseña.calificacion}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
                      {formatDate(reseña.fecha)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {reseña.texto}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay contenido */}
      {local.publicaciones.length === 0 && local.reseñas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              Este local aún no tiene publicaciones ni reseñas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
