import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VoteResults } from "@/components/VoteResults";
import { getResults } from "@/lib/votes.functions";
import { useLiveBoard } from "@/lib/use-live-board";

export const Route = createFileRoute("/resultados")({
  loader: () => getResults(),
  head: () => ({
    meta: [{ title: "Placar — Vila Oculta" }],
  }),
  component: ResultadosPage,
});

function ResultadosPage() {
  const initial = Route.useLoaderData();
  const { board, error } = useLiveBoard(initial);

  return (
    <div className="scroll-field relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <VoteResults board={board} error={error} />
      </main>
      <Footer />
    </div>
  );
}
