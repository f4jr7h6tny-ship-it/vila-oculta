import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { VillageMark } from "@/components/VillageMark";
import { toneClass, villageById, type VillageId } from "@/lib/villages";

export function DestinyReel({
  villageId,
  spinning,
}: {
  villageId: VillageId | null;
  spinning: boolean;
}) {
  const reduce = useReducedMotion();
  const village = villageId ? villageById(villageId) : null;
  const tone = village ? toneClass[village.tone] : null;

  return (
    <div className="relative mx-auto flex size-52 items-center justify-center">
      <div
        className={`destiny-ring absolute inset-0 rounded-full ${spinning ? "is-spinning" : ""}`}
        aria-hidden="true"
      />
      <div className="absolute inset-3 rounded-full border border-gold/40 bg-ink" />
      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={village ? village.id : "idle"}
            initial={reduce || !spinning ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.08 }}
            className="flex flex-col items-center"
          >
            {village && tone ? (
              <VillageMark id={village.id} className={`size-20 ${tone.text}`} />
            ) : (
              <span className="font-display text-5xl text-gold">?</span>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-2 h-5 text-center text-xs tracking-wide text-dust">
          {spinning ? "Embaralhando os selos" : village ? village.shortName : "À espera do selo"}
        </p>
      </div>
    </div>
  );
}
