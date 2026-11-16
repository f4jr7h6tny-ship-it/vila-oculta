import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DestinyReel } from "@/components/DestinyReel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultModal } from "@/components/ResultModal";
import { SpinButton } from "@/components/SpinButton";
import { VillageCard } from "@/components/VillageCard";
import { castVote, getResults } from "@/lib/votes.functions";
import { useLiveBoard } from "@/lib/use-live-board";
import {
  formatCount,
  pickVillageId,
  readStoredVote,
  runReel,
  villages,
  writeStoredVote,
  type VillageId,
} from "@/lib/villages";

export const Route = createFileRoute("/")({
  loader: () => getResults(),
  head: () => ({
    meta: [{ title: "Vila Oculta — Sorteio das Nações" }],
  }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const { board, reload, setBoard } = useLiveBoard(initial);
  const reduce = useReducedMotion();
  const [storedId, setStoredId] = useState<VillageId | null>(null);
  const [reelId, setReelId] = useState<VillageId | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    villageId: VillageId;
    fresh: boolean;
    blocked: boolean;
  } | null>(null);
  const lock = useRef(false);
  const cancelReel = useRef<(() => void) | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const stored = readStoredVote();
    if (stored) {
      setStoredId(stored.villageId);
      setReelId(stored.villageId);
    }
    return () => {
      alive.current = false;
      cancelReel.current?.();
    };
  }, []);

  async function onSpin() {
    if (lock.current) return;
    const existing = readStoredVote();
    if (existing) {
      setStoredId(existing.villageId);
      setReelId(existing.villageId);
      setModal({ villageId: existing.villageId, fresh: false, blocked: true });
      return;
    }

    lock.current = true;
    setSpinning(true);
    setError(null);
    const target = pickVillageId();
    const reel = runReel(target, setReelId);
    cancelReel.current = reel.cancel;

    try {
      await reel.promise;
      if (!alive.current) return;
      const next = await castVote({ data: { villageId: target } });
      if (!alive.current) return;
      const saved = writeStoredVote(target);
      setStoredId(saved.villageId);
      setBoard(next);
      setModal({ villageId: target, fresh: true, blocked: false });
      void reload();
    } catch {
      if (alive.current) {
        setError("O selo não fechou. Gire de novo — esse voto não entrou.");
        setReelId(null);
      }
    } finally {
      lock.current = false;
      if (alive.current) setSpinning(false);
    }
  }

  return (
    <div className="scroll-field relative flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        <motion.section
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-widest text-gold uppercase"
          >
            O destino escolhe, não você
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-4xl leading-tight text-parchment sm:text-5xl"
          >
            Qual vila você pertence?
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-dust">
            As vilas estão à mostra, mas nenhuma aceita escolha. Gire o selo: uma nação cai no
            seu nome e o voto entra sozinho no placar.
          </motion.p>
        </motion.section>

        <section className="mt-8" aria-label="Vilas participantes">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {villages.map((village) => (
              <VillageCard key={village.id} village={village} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-dust">
            Os selos acima são só consulta — não dá para clicar e escolher.
          </p>
        </section>

        <section className="mt-8 flex flex-col items-center">
          <DestinyReel villageId={reelId} spinning={spinning} />
          <div className="mt-6 w-full max-w-md">
            <SpinButton spinning={spinning} sealed={storedId !== null} onClick={() => void onSpin()} />
          </div>
          {error ? <p className="mt-3 text-center text-sm text-gold">{error}</p> : null}
          <p className="mt-4 text-center text-sm text-dust">
            {formatCount(board.total)} {board.total === 1 ? "destino selado" : "destinos selados"}
          </p>
        </section>
      </main>
      <Footer />
      <ResultModal
        villageId={modal?.villageId ?? null}
        fresh={modal?.fresh ?? false}
        blocked={modal?.blocked ?? false}
        onClose={() => setModal(null)}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
};
