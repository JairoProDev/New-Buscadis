'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
      <Button
        onClick={() => reset()}
        variant="default"
      >
        Intentar de nuevo
      </Button>
    </div>
  )
} 