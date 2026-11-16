import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { VillageMark } from "@/components/VillageMark";
import { toneClass, villageById, type VillageId } from "@/lib/villages";

const FLAKES = [
  { left: "8%", delay: "0ms" },
  { left: "18%", delay: "120ms" },
  { left: "30%", delay: "40ms" },
  { left: "42%", delay: "200ms" },
  { left: "54%", delay: "80ms" },
  { left: "66%", delay: "160ms" },
  { left: "76%", delay: "20ms" },
  { left: "88%", delay: "140ms" },
  { left: "24%", delay: "240ms" },
  { left: "60%", delay: "280ms" },
];

export function ResultModal({
  villageId,
  fresh,
  blocked,
  onClose,
}: {
  villageId: VillageId | null;
  fresh: boolean;
  blocked: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [warn, setWarn] = useState(blocked);
  const village = villageId ? villageById(villageId) : null;
  const tone = village ? toneClass[village.tone] : null;

  useEffect(() => {
    setWarn(blocked);
  }, [blocked, villageId]);

  useEffect(() => {
    if (!villageId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [villageId, onClose]);

  return (
    <AnimatePresence>
      {village && tone ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Fechar resultado"
            className="absolute inset-0 bg-ink/80"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
            className="relative z-10 max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-gold/40 bg-panel px-5 pt-6 pb-6 sm:rounded-3xl"
          >
            {!reduce && fresh ? (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden">
                {FLAKES.map((flake) => (
                  <span
                    key={`${flake.left}-${flake.delay}`}
                    className={`flake absolute top-2 size-1.5 rotate-45 ${tone.bg}`}
                    style={{ left: flake.left, animationDelay: flake.delay }}
                  />
                ))}
              </div>
            ) : null}

            <p className="text-center text-xs tracking-widest text-gold uppercase">
              {fresh ? "Voto contado" : "Destino selado"}
            </p>
            <div className={`mx-auto mt-4 w-fit rounded-full p-4 ${tone.soft}`}>
              <VillageMark id={village.id} className={`size-28 ${tone.text}`} />
            </div>
            <h2
              id="result-title"
              className="mt-5 text-center font-display text-2xl leading-tight text-parchment"
            >
              Você é da Vila de {village.name}!
            </h2>
            <p className={`mt-2 text-center text-sm ${tone.text}`}>
              {village.shortName} · {village.nation}
            </p>
            <p className="mt-4 text-center font-display text-lg leading-snug text-parchment">
              “{village.proverb}”
            </p>

            {warn ? (
              <p className="mt-4 rounded-xl border border-gold/30 bg-ink px-3 py-3 text-center text-sm text-dust">
                Seu destino já foi selado nesta sessão. Um navegador, um voto — o placar não
                conta de novo.
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/resultados"
                className="seal-btn inline-flex h-12 items-center justify-center rounded-xl px-4 font-display text-sm tracking-wide"
              >
                Ver Resultados
              </Link>
              {!warn ? (
                <button
                  type="button"
                  onClick={() => setWarn(true)}
                  className="ghost-btn inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm"
                >
                  Votar novamente
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="ghost-btn inline-flex h-12 items-center justify-center rounded-xl px-4 text-sm"
                >
                  Entendi
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
