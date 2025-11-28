"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, Store, TrendingUp } from "lucide-react";

export default function Home() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-950 dark:to-black">
        <main className="container mx-auto px-4 py-16">
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuario autenticado
  if (currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-950 dark:to-black">
        <main className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
              ¡Hola, {currentUser.nombre.split(" ")[0]}! 👋
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              {currentUser.rol === "propietario" 
                ? "Gestiona tus locales y comparte novedades con la comunidad"
                : "Descubre los mejores locales y participa en la comunidad"}
            </p>
          </div>

          {/* Grid de acciones rápidas */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <Card className="transition-shadow hover:shadow-lg border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Feed Principal</CardTitle>
                    <CardDescription>Últimas publicaciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {currentUser.rol === "propietario"
                    ? "Publica novedades sobre tus locales y ve qué comparte la comunidad"
                    : "Ve las últimas publicaciones y comenta tus favoritas"}
                </p>
                <Button asChild className="w-full">
                  <Link href="/explorar">Ver Feed</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Locales</CardTitle>
                    <CardDescription>
                      {currentUser.rol === "propietario" ? "Tus negocios" : "Descubre negocios"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {currentUser.rol === "propietario"
                    ? "Gestiona la información de tus locales registrados"
                    : "Explora todos los locales y encuentra información detallada"}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/locales">
                    {currentUser.rol === "propietario" ? "Mis Locales" : "Ver Locales"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-950">
                    <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mi Perfil</CardTitle>
                    <CardDescription>Información personal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Ve tu perfil completo, tus actividades y {currentUser.rol === "propietario" ? "locales" : "reseñas"}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/usuarios/${currentUser._id}`}>Ver Mi Perfil</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats rápidas para propietarios */}
          {currentUser.rol === "propietario" && (
            <Card className="bg-linear-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Tienes {currentUser.locales_propios.length} {currentUser.locales_propios.length === 1 ? "local registrado" : "locales registrados"}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Mantén tus locales actualizados con publicaciones frecuentes
                  </p>
                  <Button asChild variant="default" size="lg">
                    <Link href="/locales">Gestionar Locales</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mensaje para clientes */}
          {currentUser.rol === "cliente" && (
            <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">¡Participa en la comunidad!</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    Comenta en publicaciones, da likes y descubre nuevos locales
                  </p>
                  <Button asChild variant="default" size="lg">
                    <Link href="/explorar">Explorar Ahora</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  // Usuario no autenticado (landing original)
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-950 dark:to-black">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-extrabold tracking-tight">
            ¡Bienvenido a Lokay Share!
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            La mini red social para conectar con los mejores locales de tu ciudad.
            Descubre, comparte y comenta sobre tus lugares favoritos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>🌎 Explorar</CardTitle>
              <CardDescription>
                Descubre publicaciones de todos los locales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Navega por el feed público y conoce las últimas novedades de los negocios locales.
              </p>
              <Button asChild className="w-full">
                <Link href="/explorar">Ir a Explorar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>🏪 Locales</CardTitle>
              <CardDescription>
                Todos los negocios en un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Explora la lista completa de locales registrados y encuentra información detallada.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/locales">Ver Locales</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>👥 Usuarios</CardTitle>
              <CardDescription>
                Conoce a la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Descubre perfiles de clientes y propietarios de la plataforma.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/usuarios">Ver Usuarios</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="rounded-lg bg-zinc-900 p-8 text-center text-white dark:bg-zinc-800">
          <h3 className="mb-3 text-3xl font-bold">
            ¿Listo para comenzar?
          </h3>
          <p className="mb-6 text-zinc-300">
            Inicia sesión para comentar, dar likes y crear publicaciones si eres propietario.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-zinc-900 hover:bg-zinc-100">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© 2025 Lokay Share - Mini Red Social de Locales</p>
        </div>
      </footer>
    </div>
  );
}
