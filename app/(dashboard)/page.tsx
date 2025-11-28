"use client";

import { useEffect, useState } from "react";
import { getLocales, toggleLikePublicacion } from "@/lib/api";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MapPin } from "lucide-react";
import Image from "next/image";
import type { Publicacion, Local } from "@/lib/api";
import { CommentForm } from "@/components/comment-form";
import { NewPostForm } from "@/components/new-post-form";
import { useAuth } from "@/contexts/auth-context";

type PublicacionConLocal = {
  publicacion: Publicacion;
  local: Local;
};

export default function FeedPage() {
  const { currentUser, isLoading } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [feedGlobal, setFeedGlobal] = useState<PublicacionConLocal[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      const data = await getLocales();
      setLocales(data);

      // Construir feed global
      const feed: PublicacionConLocal[] = [];
      const initialLikes: Record<string, number> = {};
      const initialLikedPosts = new Set<string>();

      data.forEach((local) => {
        local.publicaciones.forEach((publicacion) => {
          feed.push({ publicacion, local });
          initialLikes[publicacion._id] = publicacion.likes;
          
          // Si el usuario actual está en likedBy, marcarlo como liked
          if (currentUser && publicacion.likedBy?.includes(currentUser._id)) {
            initialLikedPosts.add(publicacion._id);
          }
        });
      });

      // Ordenar por fecha descendente
      feed.sort((a, b) => {
        return (
          new Date(b.publicacion.fecha).getTime() -
          new Date(a.publicacion.fecha).getTime()
        );
      });

      setFeedGlobal(feed);
      setLikesCount(initialLikes);
      setLikedPosts(initialLikedPosts);
    };

    loadData();
  }, [currentUser]);

  const handleLike = async (localId: string, publicacionId: string) => {
    if (!currentUser) return;

    // Optimistic update
    const wasLiked = likedPosts.has(publicacionId);
    setLikesCount((prev) => ({
      ...prev,
      [publicacionId]: prev[publicacionId] + (wasLiked ? -1 : 1),
    }));

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(publicacionId);
      } else {
        newSet.add(publicacionId);
      }
      return newSet;
    });

    try {
      const response = await toggleLikePublicacion({
        localId,
        publicacionId,
        userId: currentUser._id,
      });

      // Actualizar con los valores reales del backend
      setLikesCount((prev) => ({
        ...prev,
        [publicacionId]: response.likes,
      }));

      // Sincronizar likedPosts con likedBy del backend
      if (response.likedBy) {
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (response.likedBy!.includes(currentUser._id)) {
            newSet.add(publicacionId);
          } else {
            newSet.delete(publicacionId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error al dar like:", error);
      // Revertir en caso de error
      setLikesCount((prev) => ({
        ...prev,
        [publicacionId]: prev[publicacionId] + (wasLiked ? 1 : -1),
      }));
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(publicacionId);
        } else {
          newSet.delete(publicacionId);
        }
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Locales del usuario propietario
  const misLocales =
    currentUser?.rol === "propietario"
      ? locales.filter((local) => local.id_propietario._id === currentUser._id)
      : [];

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {currentUser ? "Feed" : "Bienvenido"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {currentUser
            ? `Hola, ${currentUser.nombre}. Explora las últimas publicaciones.`
            : "Descubre las últimas publicaciones de los locales"}
        </p>
      </div>

      {/* Formulario de nueva publicación (solo propietarios) */}
      {currentUser?.rol === "propietario" && misLocales.length > 0 && (
        <NewPostForm locales={misLocales} />
      )}

      {/* Mensaje si no está autenticado */}
      {!currentUser && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
              <Link href="/login" className="font-semibold hover:underline">
                Inicia sesión
              </Link>{" "}
              o{" "}
              <Link href="/register" className="font-semibold hover:underline">
                regístrate
              </Link>{" "}
              para comentar y participar
            </p>
          </CardContent>
        </Card>
      )}

      {feedGlobal.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No hay publicaciones disponibles en este momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {feedGlobal.map((item) => (
            <Card key={item.publicacion._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage
                        src={item.local.id_propietario.foto_perfil}
                        alt={item.local.id_propietario.nombre}
                      />
                      <AvatarFallback>
                        {item.local.id_propietario.nombre
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                          {item.local.id_propietario.nombre}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          @{item.local.id_propietario.usuario}
                        </span>
                      </div>
                      <Link
                        href={`/locales/${item.local._id}`}
                        className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {item.local.nombre}
                      </Link>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.local.direccion.ciudad},{" "}
                        {item.local.direccion.region}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(item.publicacion.fecha)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Texto */}
                <p className="text-sm text-zinc-900 dark:text-white whitespace-pre-wrap">
                  {item.publicacion.texto}
                </p>

                {/* Imagen */}
                {item.publicacion.url_imagen && (
                  <div className="rounded-lg overflow-hidden relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={item.publicacion.url_imagen}
                      alt="Imagen de publicación"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                )}

                {/* Estadísticas */}
                <div className="flex items-center gap-6 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 p-0 h-auto"
                    onClick={() => handleLike(item.local._id, item.publicacion._id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedPosts.has(item.publicacion._id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {likesCount[item.publicacion._id] || 0}
                    </span>
                  </Button>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {item.publicacion.comentarios.length}
                    </span>
                  </div>
                </div>

                {/* Últimos comentarios */}
                {item.publicacion.comentarios.length > 0 && (
                  <div className="space-y-3 pt-2 border-t">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                      Comentarios recientes
                    </p>
                    {item.publicacion.comentarios
                      .slice(-2)
                      .map((comentario) => (
                        <div
                          key={comentario._id}
                          className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3"
                        >
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
                      ))}
                  </div>
                )}

                {/* Formulario de comentarios (solo usuarios autenticados) */}
                {currentUser && (
                  <CommentForm
                    localId={item.local._id}
                    publicacionId={item.publicacion._id}
                    usuarioId={currentUser._id}
                    usuarioNombre={currentUser.nombre}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
