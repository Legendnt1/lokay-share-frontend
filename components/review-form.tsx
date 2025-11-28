"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { createResena } from "@/lib/api";

interface ReviewFormProps {
  localId: string;
  usuarioId: string;
  usuarioNombre: string;
  onReviewCreated?: () => void;
}

export function ReviewForm({
  localId,
  usuarioId,
  usuarioNombre,
  onReviewCreated,
}: ReviewFormProps) {
  const [calificacion, setCalificacion] = useState(0);
  const [hoverCalificacion, setHoverCalificacion] = useState(0);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion === 0) return;

    setLoading(true);
    try {
      await createResena({
        localId,
        userId: usuarioId,
        usuarioNombre,
        calificacion,
        texto: texto.trim() || undefined,
      });

      // Limpiar formulario
      setCalificacion(0);
      setTexto("");
      onReviewCreated?.();
      router.refresh();
    } catch (error) {
      console.error("Error al crear reseña:", error);
      alert("Error al crear la reseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Calificación *</Label>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCalificacion(starValue)}
                onMouseEnter={() => setHoverCalificacion(starValue)}
                onMouseLeave={() => setHoverCalificacion(0)}
                disabled={loading}
                className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
              >
                <Star
                  className={`h-8 w-8 ${
                    starValue <= (hoverCalificacion || calificacion)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  }`}
                />
              </button>
            );
          })}
          {calificacion > 0 && (
            <span className="ml-2 text-sm font-medium text-zinc-900 dark:text-white">
              {calificacion}/5
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="texto">Comentario (opcional)</Label>
        <Textarea
          id="texto"
          placeholder="Cuéntanos sobre tu experiencia..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={loading}
          rows={3}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || calificacion === 0}
        className="w-full"
      >
        {loading ? "Enviando..." : "Enviar Reseña"}
      </Button>
    </form>
  );
}
