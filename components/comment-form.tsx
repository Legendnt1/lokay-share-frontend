"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComentarioPublicacion } from "@/lib/api";
import { MessageCircle } from "lucide-react";

interface CommentFormProps {
  localId: string;
  publicacionId: string;
  usuarioId: string;
  usuarioNombre: string;
  onCommentCreated?: () => void;
}

export function CommentForm({
  localId,
  publicacionId,
  usuarioId,
  usuarioNombre,
  onCommentCreated,
}: CommentFormProps) {
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setLoading(true);
    try {
      await createComentarioPublicacion({
        localId,
        publicacionId,
        userId: usuarioId,
        usuarioNombre,
        texto: comentario,
      });

      setComentario("");
      onCommentCreated?.();
      router.refresh();
    } catch (error) {
      console.error("Error al crear comentario:", error);
      alert("Error al crear el comentario. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t">
      <Textarea
        placeholder="Escribe un comentario..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        disabled={loading}
        rows={2}
        className="resize-none text-sm"
      />
      <Button type="submit" disabled={loading || !comentario.trim()} size="sm">
        <MessageCircle className="h-4 w-4 mr-2" />
        {loading ? "Comentando..." : "Comentar"}
      </Button>
    </form>
  );
}
