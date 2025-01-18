"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
} 