"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { toggleLikePublicacion } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { CommentForm } from "@/components/comment-form";
import type { Publicacion } from "@/lib/api";

interface PublicacionesInteractivasProps {
  publicaciones: Publicacion[];
  localId: string;
}

export function PublicacionesInteractivas({
  publicaciones,
  localId,
}: PublicacionesInteractivasProps) {
  const { currentUser } = useAuth();
  const [likesCount, setLikesCount] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    publicaciones.forEach((pub) => {
      initial[pub._id] = pub.likes;
    });
    return initial;
  });
  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentUser) {
      publicaciones.forEach((pub) => {
        if (pub.likedBy?.includes(currentUser._id)) {
          initial.add(pub._id);
        }
      });
    }
    return initial;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleLike = async (publicacionId: string) => {
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

  return (
    <div className="space-y-4">
      {publicaciones.map((publicacion) => (
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
              {currentUser ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 p-0 h-auto"
                  onClick={() => handleLike(publicacion._id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      likedPosts.has(publicacion._id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {likesCount[publicacion._id] || 0}
                  </span>
                  <span className="text-xs">
                    {(likesCount[publicacion._id] || 0) === 1 ? "like" : "likes"}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {likesCount[publicacion._id] || 0}
                  </span>
                  <span className="text-xs">
                    {(likesCount[publicacion._id] || 0) === 1 ? "like" : "likes"}
                  </span>
                </div>
              )}
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

            {/* Formulario de comentarios (solo usuarios autenticados) */}
            {currentUser && (
              <CommentForm
                localId={localId}
                publicacionId={publicacion._id}
                usuarioId={currentUser._id}
                usuarioNombre={currentUser.nombre}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
