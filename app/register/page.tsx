"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { crearUsuario } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Lock, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    confirmPassword: "",
    foto_perfil: "",
    rol: "cliente" as "cliente" | "propietario",
  });
  const [errors, setErrors] = useState<{
    nombre?: string;
    usuario?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    foto_perfil?: string;
    rol?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validar nombre
    if (!formData.nombre) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Validar usuario
    if (!formData.usuario) {
      newErrors.usuario = "El usuario es obligatorio";
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario =
        "El usuario solo puede contener letras, números y guiones bajos";
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar foto_perfil
    if (!formData.foto_perfil) {
      newErrors.foto_perfil = "La URL de la foto de perfil es obligatoria";
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.foto_perfil)) {
      newErrors.foto_perfil = "La URL debe ser válida y terminar en .jpg, .png, .gif o .webp";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Crear usuario usando el endpoint POST /api/usuarios
      const nuevoUsuario = await crearUsuario({
        nombre: formData.nombre,
        usuario: formData.usuario,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        foto_perfil: formData.foto_perfil,
      });

      // Establecer usuario actual en el contexto (auto-login después del registro)
      setCurrentUser(nuevoUsuario);

      // Redirigir al feed
      router.push("/");
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors({
        email:
          error instanceof Error
            ? error.message
            : "Error al crear la cuenta. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black relative px-4 py-8">
      {/* Theme toggle en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card de registro centrado */}
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>
            Completa los datos para registrarte en Lokay Share
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Campo de Nombre */}
            <div className="space-y-2">
              <label
                htmlFor="nombre"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange("nombre")}
                  className={`pl-10 ${
                    errors.nombre
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.nombre && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.nombre}</span>
                </div>
              )}
            </div>

            {/* Campo de Usuario */}
            <div className="space-y-2">
              <label
                htmlFor="usuario"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Usuario
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-400">
                  @
                </span>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="juanperez"
                  value={formData.usuario}
                  onChange={handleChange("usuario")}
                  className={`pl-7 ${
                    errors.usuario
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.usuario && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.usuario}</span>
                </div>
              )}
            </div>

            {/* Campo de Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className={`pl-10 ${
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Campo de Foto de Perfil */}
            <div className="space-y-2">
              <label
                htmlFor="foto_perfil"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                URL de foto de perfil
              </label>
              <Input
                id="foto_perfil"
                type="url"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.foto_perfil}
                onChange={handleChange("foto_perfil")}
                className={
                  errors.foto_perfil
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isLoading}
              />
              {errors.foto_perfil && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.foto_perfil}</span>
                </div>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ejemplo: https://randomuser.me/api/portraits/men/1.jpg
              </p>
            </div>

            {/* Campo de Rol */}
            <div className="space-y-2">
              <label
                htmlFor="rol"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Tipo de cuenta
              </label>
              <select
                id="rol"
                value={formData.rol}
                onChange={handleChange("rol")}
                className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                disabled={isLoading}
              >
                <option value="cliente">Cliente</option>
                <option value="propietario">Propietario</option>
              </select>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formData.rol === "propietario"
                  ? "Podrás crear y administrar locales"
                  : "Podrás explorar y comentar en locales"}
              </p>
            </div>

            {/* Campo de Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange("password")}
                  className={`pl-10 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Campo de Confirmar Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className={`pl-10 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-zinc-900 dark:text-white font-medium hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
