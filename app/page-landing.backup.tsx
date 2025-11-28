import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
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
    </div>
  );
}
