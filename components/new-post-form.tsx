"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPublicacion } from "@/lib/api";
import { PlusCircle, ImagePlus } from "lucide-react";
import type { Local } from "@/lib/api";

interface NewPostFormProps {
  locales: Local[];
  onPostCreated?: () => void;
}

export function NewPostForm({ locales, onPostCreated }: NewPostFormProps) {
  const [localId, setLocalId] = useState("");
  const [texto, setTexto] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localId || !texto.trim()) return;

    setLoading(true);
    try {
      await createPublicacion({
        localId,
        texto,
        url_imagen: urlImagen || undefined,
      });

      // Limpiar formulario
      setLocalId("");
      setTexto("");
      setUrlImagen("");
      onPostCreated?.();
      router.refresh();
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Error al crear la publicación. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Crear nueva publicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="local">Local *</Label>
            <Select value={localId} onValueChange={setLocalId} disabled={loading}>
              <SelectTrigger id="local">
                <SelectValue placeholder="Selecciona un local" />
              </SelectTrigger>
              <SelectContent>
                {locales.map((local) => (
                  <SelectItem key={local._id} value={local._id}>
                    {local.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="texto">Mensaje *</Label>
            <Textarea
              id="texto"
              placeholder="¿Qué quieres compartir?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              disabled={loading}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Imagen (opcional)
            </Label>
            <Input
              id="imagen"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={urlImagen}
              onChange={(e) => setUrlImagen(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !localId || !texto.trim()}
            className="w-full"
          >
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
