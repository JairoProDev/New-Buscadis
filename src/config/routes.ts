export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verify: "/auth/verify",
    error: "/auth/error",
    logout: "/auth/logout",
  },
  adisos: {
    index: "/adisos",
    show: (id: string) => `/adisos/${id}`,
    edit: (id: string) => `/adisos/${id}/editar`,
    new: "/adisos/nuevo",
  },
  categorias: {
    show: (slug: string) => `/categorias/${slug}`,
  },
  premium: {
    index: "/premium",
    pricing: "/premium/precios",
    checkout: "/premium/checkout",
  },
  legal: {
    privacy: "/legal/privacidad",
    terms: "/legal/terminos",
    cookies: "/legal/cookies",
  },
  info: {
    about: "/info/nosotros",
    contact: "/info/contacto",
    help: "/info/ayuda",
    faq: "/info/faq",
  },
  social: {
    twitter: "https://twitter.com/buscadis",
    facebook: "https://facebook.com/buscadis",
    instagram: "https://instagram.com/buscadis",
  },
} as const 