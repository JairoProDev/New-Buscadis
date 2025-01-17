import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(options?: { required?: boolean; role?: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (options?.required && status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (
      options?.role &&
      status === "authenticated" &&
      session?.user?.role !== options.role
    ) {
      router.push("/")
    }
  }, [session, status, router, options])

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
  }
} 