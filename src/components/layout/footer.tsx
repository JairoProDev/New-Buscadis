import * as React from "react"
import Link from "next/link"

import { routes } from "@/config/routes"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center gap-4 md:h-24 md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={routes.social.twitter}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium underline underline-offset-4"
            >
              BuscaDis
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/buscadis/buscadis"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={routes.legal.privacy}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacidad
          </Link>
          <Link
            href={routes.legal.terms}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Términos
          </Link>
        </div>
      </div>
    </footer>
  )
} 