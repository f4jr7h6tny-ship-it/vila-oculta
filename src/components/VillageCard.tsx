import { VillageMark } from "@/components/VillageMark";
import { toneClass, type Village } from "@/lib/villages";

export function VillageCard({ village }: { village: Village }) {
  const tone = toneClass[village.tone];
  return (
    <article className={`village-card ${tone.card} rounded-2xl p-3 sm:p-4`}>
      <div className={`mb-3 inline-flex rounded-full p-2 ${tone.soft}`}>
        <VillageMark id={village.id} className={`size-10 ${tone.text}`} />
      </div>
      <h3 className="font-display text-sm leading-tight text-parchment sm:text-base">
        {village.name}
      </h3>
      <p className="mt-1 text-xs text-dust sm:text-sm">{village.shortName}</p>
    </article>
  );
}
