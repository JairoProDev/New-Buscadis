'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
          <Button
            onClick={() => reset()}
            variant="default"
          >
            Intentar de nuevo
          </Button>
        </div>
      </body>
    </html>
  )
} 