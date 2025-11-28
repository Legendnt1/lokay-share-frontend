"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "@/components/review-form";
import { Star } from "lucide-react";
import Link from "next/link";

interface ReviewFormClientProps {
  localId: string;
}

export function ReviewFormClient({ localId }: ReviewFormClientProps) {
  const { currentUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

  // Si no hay usuario autenticado, mostrar mensaje
  if (!currentUser) {
    return (
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
            <Link href="/login" className="font-semibold hover:underline">
              Inicia sesión
            </Link>{" "}
            para dejar una reseña
          </p>
        </CardContent>
      </Card>
    );
  }

  // Si el usuario es propietario, no mostrar nada o mostrar mensaje informativo
  if (currentUser.rol === "propietario") {
    return null;
  }

  // Usuario cliente - mostrar botón para dejar reseña
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Dejar una reseña
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">Escribir Reseña</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Reseña</DialogTitle>
              <DialogDescription>
                Comparte tu experiencia con este local
              </DialogDescription>
            </DialogHeader>
            <ReviewForm
              localId={localId}
              usuarioId={currentUser._id}
              usuarioNombre={currentUser.nombre}
              onReviewCreated={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
