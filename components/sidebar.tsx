"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Store, Users, LogOut, LogIn, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewPostForm } from "@/components/new-post-form";
import { useState, useEffect } from "react";
import { getLocales, type Local } from "@/lib/api";

const routes = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    label: "Explorar",
    href: "/explorar",
    icon: Search,
  },
  {
    label: "Locales",
    href: "/locales",
    icon: Store,
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (currentUser?.rol === "propietario") {
      const loadLocales = async () => {
        try {
          const todosLocales = await getLocales();
          const misLocales = todosLocales.filter((local) =>
            currentUser.locales_propios.includes(local._id)
          );
          setLocales(misLocales);
        } catch (error) {
          console.error("Error cargando locales:", error);
        }
      };
      loadLocales();
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-56 border-r bg-white dark:bg-zinc-950 h-screen sticky top-0 hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Lokay Share
        </h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;

          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive &&
                    "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                )}
              >
                <Icon className="h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Botón de nueva publicación para propietarios */}
      {currentUser?.rol === "propietario" && locales.length > 0 && (
        <div className="px-3 pb-3">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2" size="sm">
                <PlusCircle className="h-4 w-4" />
                Nueva Publicación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear nueva publicación</DialogTitle>
                <DialogDescription>
                  Comparte novedades sobre tus locales con la comunidad
                </DialogDescription>
              </DialogHeader>
              <NewPostForm
                locales={locales}
                onPostCreated={() => {
                  setOpenDialog(false);
                  router.refresh();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="p-4 border-t space-y-3">
        {isAuthenticated && currentUser ? (
          <>
            <Link href={`/usuarios/${currentUser._id}`}>
              <div className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentUser.foto_perfil}
                    alt={currentUser.nombre}
                  />
                  <AvatarFallback className="text-xs">
                    {currentUser.nombre.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                    {currentUser.nombre}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    @{currentUser.usuario}
                  </p>
                </div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Button>
          </Link>
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          © 2025 Lokay Share
        </p>
      </div>
    </aside>
  );
}
