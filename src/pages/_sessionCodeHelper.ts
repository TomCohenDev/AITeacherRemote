import { useParams } from "react-router-dom";

/**
 * Tries to read the 5-letter session code from either URL params or props.
 * Fallback allows passing code explicitly.
 */
export function useSessionCodeFallback(explicit?: string): string {
  const params = useParams();
  const fromParam = (params as any)?.code as string | undefined;
  const code = (explicit || fromParam || "").toUpperCase();
  return code;
}
