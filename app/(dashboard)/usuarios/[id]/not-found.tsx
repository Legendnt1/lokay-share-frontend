import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX } from "lucide-react";

export default function UsuarioNotFound() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="py-16 text-center space-y-6">
          <UserX className="h-20 w-20 mx-auto text-zinc-400 dark:text-zinc-600" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Usuario no encontrado
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              El usuario que estás buscando no existe o ha sido eliminado.
            </p>
          </div>
          <Link href="/usuarios">
            <Button>Volver a usuarios</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
