const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
}

export type Usuario = {
  _id: string;
  nombre: string;
  usuario: string;
  email: string;
  foto_perfil: string;
  rol: "cliente" | "propietario" | string;
  locales_propios: string[];
  fecha_registro: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Direccion = {
  pais: string;
  region: string;
  ciudad: string;
  distrito: string;
  calle: string;
  referencia: string;
};

export type Reseña = {
  _id: string;
  id_usuario: string;
  usuario_nombre: string;
  calificacion: number;
  texto: string;
  fecha: string;
};

export type ComentarioPublicacion = {
  _id: string;
  id_usuario: string;
  usuario_nombre: string;
  texto: string;
  fecha: string;
};

export type Publicacion = {
  _id: string;
  texto: string;
  url_imagen?: string;
  likes: number;
  fecha: string;
  comentarios: ComentarioPublicacion[];
  likedBy?: string[];
};

export type Local = {
  _id: string;
  nombre: string;
  descripcion: string;
  lokayShopUrl: string;
  direccion: Direccion;
  horarios: string;
  id_propietario: Usuario;
  reseñas: Reseña[];
  publicaciones: Publicacion[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ResenaPayload = {
  localId: string;
  userId: string;
  usuarioNombre: string;
  calificacion: number; // 1 a 5
  texto?: string;
};

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(`${API_BASE}/api/usuarios`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error obteniendo usuarios");
  }

  return res.json();
}

export async function getLocales(): Promise<Local[]> {
  const res = await fetch(`${API_BASE}/api/locales`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error obteniendo locales");
  }

  return res.json();
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const usuarios = await getUsuarios();
    return usuarios.find((u) => u._id === id) || null;
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
}

export async function getLocalById(id: string): Promise<Local | null> {
  try {
    const locales = await getLocales();
    return locales.find((l) => l._id === id) || null;
  } catch (error) {
    console.error("Error obteniendo local:", error);
    return null;
  }
}

// ===== FUNCIONES DE ESCRITURA (POST) =====

// Crear nuevo usuario (registro)
export async function crearUsuario(data: {
  nombre: string;
  usuario: string;
  email: string;
  password: string;
  rol: "cliente" | "propietario";
  foto_perfil?: string;
}): Promise<Usuario> {
  const res = await fetch(`${API_BASE}/api/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear usuario");
  }

  return res.json();
}

// Crear comentario en una publicación
export async function createComentarioPublicacion(params: {
  localId: string;
  publicacionId: string;
  userId: string;
  usuarioNombre: string;
  texto: string;
}) {
  const res = await fetch(
    `${API_BASE}/api/locales/${params.localId}/publicaciones/${params.publicacionId}/comentarios`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: params.userId,
        usuarioNombre: params.usuarioNombre,
        texto: params.texto,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando comentario: ${text}`);
  }

  return res.json();
}

// Crear reseña en un local
export async function createResena(params: ResenaPayload) {
  const res = await fetch(
    `${API_BASE}/api/locales/${params.localId}/resenas`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: params.userId,
        usuarioNombre: params.usuarioNombre,
        calificacion: params.calificacion,
        texto: params.texto ?? "",
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando reseña: ${text}`);
  }

  return res.json();
}

// Crear publicación en un local
export async function createPublicacion(params: {
  localId: string;
  texto: string;
  url_imagen?: string;
}): Promise<Publicacion> {
  const res = await fetch(
    `${API_BASE}/api/locales/${params.localId}/publicaciones`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: params.texto,
        url_imagen: params.url_imagen || null,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando publicación: ${text}`);
  }

  return res.json();
}


export async function toggleLikePublicacion(params: {
  localId: string;
  publicacionId: string;
  userId: string;
}) {
  const res = await fetch(
    `${API_BASE}/api/locales/${params.localId}/publicaciones/${params.publicacionId}/like`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: params.userId }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al actualizar like: ${text}`);
  }

  // Ajusta este tipo si tu backend devuelve algo distinto
  return res.json() as Promise<{
    message: string;
    likes: number;
    likedBy?: string[];
  }>;
}