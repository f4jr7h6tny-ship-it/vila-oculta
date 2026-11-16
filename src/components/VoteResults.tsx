import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { VillageMark } from "@/components/VillageMark";
import type { Board } from "@/lib/votes.functions";
import {
  formatCount,
  formatPercent,
  toneClass,
  villageById,
  type VillageId,
} from "@/lib/villages";

function ranked(board: Board) {
  const sorted = [...board.villages].sort((a, b) => b.votes - a.votes || a.id.localeCompare(b.id));
  let lastVotes = -1;
  let lastRank = 0;
  return sorted.map((row, index) => {
    const rank = row.votes === lastVotes ? lastRank : index + 1;
    lastVotes = row.votes;
    lastRank = rank;
    return { ...row, rank };
  });
}

function RankBadge({ rank, votes }: { rank: number; votes: number }) {
  if (votes <= 0) {
    return (
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-sm text-dust">
        –
      </span>
    );
  }
  if (rank > 3) {
    return (
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line font-display text-sm text-dust">
        {rank}º
      </span>
    );
  }
  const tone =
    rank === 1 ? "bg-gold text-ink" : rank === 2 ? "bg-dust text-ink" : "bg-stone text-parchment";
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm ${tone}`}
    >
      {rank}º
    </span>
  );
}

export function VoteResults({ board, error }: { board: Board; error: string | null }) {
  const reduce = useReducedMotion();
  const rows = ranked(board);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35 }}
      >
        <p className="text-center text-xs tracking-widest text-gold uppercase">Placar dos votos</p>
        <h1 className="mt-2 text-center font-display text-4xl text-parchment">
          {formatCount(board.total)}
        </h1>
        <p className="text-center text-dust">destinos selados no total</p>
        <p className="mt-2 text-center text-xs text-dust">Atualiza sozinho a cada poucos segundos.</p>
        {error ? <p className="mt-3 text-center text-sm text-gold">{error}</p> : null}
      </motion.div>

      <ol className="mt-8 flex flex-col gap-3">
        {rows.map((row, index) => {
          const village = villageById(row.id as VillageId);
          const tone = toneClass[village.tone];
          const percent = board.total > 0 ? (row.votes / board.total) * 100 : 0;
          return (
            <motion.li
              key={row.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : index * 0.05 }}
              className={`village-card ${tone.card} rounded-2xl p-4`}
            >
              <div className="flex items-center gap-3">
                <RankBadge rank={row.rank} votes={row.votes} />
                <VillageMark id={village.id} className={`size-10 shrink-0 ${tone.text}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base leading-tight text-parchment">
                    {village.name}
                  </p>
                  <p className="text-sm text-dust">{village.shortName}</p>
                </div>
                <p className="font-display text-2xl text-parchment tabular-nums">
                  {formatCount(row.votes)}
                </p>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={percent}
                  tone={village.tone}
                  label={`Votos de ${village.shortName}`}
                />
                <p className="mt-1 text-right text-sm text-dust">
                  {formatPercent(row.votes, board.total)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="ghost-btn inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm"
        >
          Voltar para Votação
        </Link>
      </div>
    </div>
  );
}
