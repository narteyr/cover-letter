import { useRouter } from "next/navigation";

/** Stub for standalone mode - no Firebase auth */
export function useAuthActions() {
  const router = useRouter();

  const handleLogout = async () => {
    router.push("/");
  };

  return { handleLogout };
}
