import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR',
    notation?: Intl.NumberFormatOptions['notation']
  } = {}
) {
  const { currency = 'EUR', notation = 'compact' } = options

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
  }).format(d)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export function getInitials(name: string) {
  const words = name.split(' ')
  const initials = words.map((word) => word[0]).join('')
  return initials.toUpperCase()
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex,
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
} = {}) {
  return {
    title: title ? `${title} | BuscaDis` : undefined,
    description,
    openGraph: {
      title: title ? `${title} | BuscaDis` : undefined,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title: title ? `${title} | BuscaDis` : undefined,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str) 