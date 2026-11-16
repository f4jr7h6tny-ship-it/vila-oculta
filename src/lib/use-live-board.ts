import { useCallback, useEffect, useState } from "react";
import { getResults, type Board } from "@/lib/votes.functions";

export function useLiveBoard(initial: Board) {
  const [board, setBoard] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const next = await getResults();
      setBoard(next);
      setError(null);
      return next;
    } catch {
      setError("O placar não respondeu. A próxima tentativa é automática.");
      return null;
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      void reload();
    }, 5000);
    return () => window.clearInterval(id);
  }, [reload]);

  return { board, error, reload, setBoard };
}
