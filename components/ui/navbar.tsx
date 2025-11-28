"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/usuarios", label: "Usuarios" },
  { href: "/explorar", label: "Explorar" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/70 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / título */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold">
            MS
          </span>
          <span className="font-semibold text-sm sm:text-base">
            Mini Social
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden sm:flex items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Button
                key={link.href}
                variant={active ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            );
          })}
        </nav>

        {/* Lado derecho: luego aquí puedes meter login real */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Avatar className="hidden sm:inline-flex h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}