export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    verify: "/auth/verify",
  },
  anuncios: {
    index: "/anuncios",
    nuevo: "/anuncios/nuevo",
    show: (id: string) => `/anuncios/${id}`,
    edit: (id: string) => `/anuncios/${id}/editar`,
  },
  categorias: "/categorias",
  premium: "/premium",
  legal: {
    terminos: "/terminos",
    privacidad: "/privacidad",
    cookies: "/cookies",
  },
  info: {
    sobreNosotros: "/sobre-nosotros",
    blog: "/blog",
    contacto: "/contacto",
  },
  social: {
    twitter: "https://twitter.com/buscadis",
    instagram: "https://instagram.com/buscadis",
    facebook: "https://facebook.com/buscadis",
  },
} as const 